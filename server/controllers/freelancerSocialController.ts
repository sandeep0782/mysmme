import { Request, Response } from "express";
import SocialAccount, { ISocialAccount } from "../models/socialAccountModel";
import { response } from "../utils/responseHandler";

/* ================================================================
   CREATOR SCORE
================================================================ */

const calculateCreatorScore = (account: Partial<ISocialAccount>) => {
  const followers = Number(account.followers || 0);
  const views = Number(account.views || 0);
  const engagement = Number(account.engagement || 0);
  const growth = Number(account.growth || 0);
  const mediaCount = Number(account.mediaCount || 0);

  /* Followers score */

  let followerScore = 0;

  if (followers >= 100000) {
    followerScore = 100;
  } else if (followers >= 50000) {
    followerScore = 90;
  } else if (followers >= 25000) {
    followerScore = 80;
  } else if (followers >= 10000) {
    followerScore = 70;
  } else if (followers >= 5000) {
    followerScore = 60;
  } else if (followers >= 2000) {
    followerScore = 50;
  } else if (followers >= 1000) {
    followerScore = 40;
  } else if (followers > 0) {
    followerScore = 25;
  }

  /* Views score */

  let viewScore = 0;

  if (views >= 100000) {
    viewScore = 100;
  } else if (views >= 50000) {
    viewScore = 90;
  } else if (views >= 25000) {
    viewScore = 80;
  } else if (views >= 10000) {
    viewScore = 70;
  } else if (views >= 5000) {
    viewScore = 60;
  } else if (views >= 1000) {
    viewScore = 40;
  } else if (views > 0) {
    viewScore = 20;
  }

  /* Engagement score */

  let engagementRate = 0;

  if (followers > 0) {
    engagementRate = (engagement / followers) * 100;
  }

  let engagementScore = 0;

  if (engagementRate >= 8) {
    engagementScore = 100;
  } else if (engagementRate >= 6) {
    engagementScore = 90;
  } else if (engagementRate >= 4) {
    engagementScore = 80;
  } else if (engagementRate >= 3) {
    engagementScore = 70;
  } else if (engagementRate >= 2) {
    engagementScore = 60;
  } else if (engagementRate >= 1) {
    engagementScore = 45;
  } else if (engagementRate > 0) {
    engagementScore = 25;
  }

  /* Growth score */

  let growthScore = 0;

  if (growth >= 10) {
    growthScore = 100;
  } else if (growth >= 7) {
    growthScore = 90;
  } else if (growth >= 5) {
    growthScore = 80;
  } else if (growth >= 3) {
    growthScore = 70;
  } else if (growth >= 1) {
    growthScore = 60;
  } else if (growth >= 0) {
    growthScore = 50;
  } else {
    growthScore = 20;
  }

  /* Activity score */

  let activityScore = 0;

  if (mediaCount >= 100) {
    activityScore = 100;
  } else if (mediaCount >= 50) {
    activityScore = 80;
  } else if (mediaCount >= 25) {
    activityScore = 70;
  } else if (mediaCount >= 10) {
    activityScore = 60;
  } else if (mediaCount >= 5) {
    activityScore = 45;
  } else if (mediaCount > 0) {
    activityScore = 25;
  }

  /*
    Weighting:

    Followers   20%
    Views       30%
    Engagement  30%
    Activity    10%
    Growth      10%
  */

  const score =
    followerScore * 0.2 +
    viewScore * 0.3 +
    engagementScore * 0.3 +
    activityScore * 0.1 +
    growthScore * 0.1;

  return {
    creatorScore: Math.max(0, Math.min(100, Math.round(score))),

    engagementRate: Number(engagementRate.toFixed(2)),
  };
};

/* ================================================================
   CREATOR STATUS
================================================================ */

const getCreatorStatus = (
  account: Partial<ISocialAccount>,
): ISocialAccount["creatorStatus"] => {
  if (account.isVerified) {
    return "Verified";
  }

  if (account.syncStatus === "failed") {
    return "In Review";
  }

  return "Basic";
};

/* ================================================================
   UPDATE SCORE + STATUS
================================================================ */

const updateCreatorRating = (account: ISocialAccount) => {
  const rating = calculateCreatorScore(account);

  account.creatorScore = rating.creatorScore;

  account.creatorStatus = getCreatorStatus(account);

  return rating;
};

/* ================================================================
   GET SOCIAL ACCOUNTS
================================================================ */

export const getSocialAccounts = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const accounts = await SocialAccount.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return response(res, 200, "Social accounts fetched successfully", accounts);
  } catch (error) {
    console.error("GET SOCIAL ACCOUNTS ERROR:", error);

    return response(res, 500, "Unable to fetch social accounts");
  }
};

/* ================================================================
   CREATE SOCIAL ACCOUNT
================================================================ */

export const createSocialAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const { platform, username, profileUrl, followers } = req.body;

    if (!platform) {
      return response(res, 400, "Platform is required");
    }

    if (!username?.trim()) {
      return response(res, 400, "Username is required");
    }

    if (!profileUrl?.trim()) {
      return response(res, 400, "Profile URL is required");
    }

    const allowedPlatforms = [
      "Instagram",
      "Facebook",
      "YouTube",
      "TikTok",
      "Pinterest",
    ];

    if (!allowedPlatforms.includes(platform)) {
      return response(res, 400, "Invalid social platform");
    }

    const cleanUsername = username.trim().replace(/^@/, "");

    const existingAccount = await SocialAccount.findOne({
      user: userId,
      platform,
      username: cleanUsername,
    });

    if (existingAccount) {
      return response(res, 409, "Social account already connected");
    }

    const account = new SocialAccount({
      user: userId,

      platform,

      username: cleanUsername,

      profileUrl: profileUrl.trim(),

      followers: Math.max(0, Number(followers || 0)),

      views: 0,

      engagement: 0,

      growth: 0,

      reach: 0,

      likes: 0,

      comments: 0,

      shares: 0,

      saves: 0,

      mediaCount: 0,

      isVerified: false,

      creatorScore: 0,

      creatorStatus: "Basic",

      syncStatus: "idle",

      lastSyncedAt: null,

      nextSyncAt: null,
    });

    updateCreatorRating(account);

    await account.save();

    return response(res, 201, "Social account connected successfully", account);
  } catch (error: any) {
    console.error("CREATE SOCIAL ACCOUNT ERROR:", error);

    if (error?.code === 11000) {
      return response(res, 409, "Social account already connected");
    }

    return response(res, 500, "Unable to connect social account");
  }
};

/* ================================================================
   SYNC INSTAGRAM STATS
================================================================ */

export const syncInstagramStats = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    const { accountId } = req.params;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const account = await SocialAccount.findOne({
      _id: accountId,
      user: userId,
    }).select("+accessToken");

    if (!account) {
      return response(res, 404, "Social account not found");
    }

    if (account.platform !== "Instagram") {
      return response(
        res,
        400,
        "Stats sync is currently available only for Instagram",
      );
    }

    if (!account.instagramAccountId || !account.accessToken) {
      account.creatorStatus = "Basic";

      await account.save();

      return response(
        res,
        400,
        "Instagram authorization is required before syncing statistics",
      );
    }

    if (
      account.tokenExpiresAt &&
      account.tokenExpiresAt.getTime() < Date.now()
    ) {
      account.syncStatus = "failed";

      account.syncError = "Instagram access token has expired";

      account.creatorStatus = "In Review";

      await account.save();

      return response(
        res,
        401,
        "Instagram authorization has expired. Please reconnect Instagram.",
      );
    }

    const graphVersion = process.env.META_GRAPH_VERSION || "v24.0";

    const fields = ["id", "username", "followers_count", "media_count"].join(
      ",",
    );

    const profileUrl =
      `https://graph.facebook.com/${graphVersion}` +
      `/${account.instagramAccountId}` +
      `?fields=${encodeURIComponent(fields)}` +
      `&access_token=${encodeURIComponent(account.accessToken)}`;

    const profileRes = await fetch(profileUrl);

    const profileData: any = await profileRes.json();

    if (!profileRes.ok) {
      console.error("META INSTAGRAM PROFILE ERROR:", profileData);

      account.syncStatus = "failed";

      account.syncError =
        profileData?.error?.message || "Unable to fetch Instagram profile";

      account.creatorStatus = "In Review";

      await account.save();

      return response(
        res,
        400,
        profileData?.error?.message || "Unable to fetch Instagram statistics",
      );
    }

    const previousFollowers = Number(account.followers || 0);

    const newFollowers = Number(profileData.followers_count || 0);

    let growth = 0;

    if (previousFollowers > 0) {
      growth = ((newFollowers - previousFollowers) / previousFollowers) * 100;
    }

    account.username = profileData.username || account.username;

    account.followers = newFollowers;

    account.mediaCount = Number(profileData.media_count || 0);

    account.growth = Number(growth.toFixed(2));

    account.isVerified = true;

    account.lastSyncedAt = new Date();

    account.nextSyncAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    account.syncStatus = "success";

    account.syncError = undefined;

    /*
      Calculate new creator score
      after new Instagram stats arrive.
    */

    updateCreatorRating(account);

    await account.save();

    const safeAccount = await SocialAccount.findById(account._id);

    return response(
      res,
      200,
      "Instagram statistics synced successfully",
      safeAccount,
    );
  } catch (error: any) {
    console.error("SYNC INSTAGRAM STATS ERROR:", error);

    return response(
      res,
      500,
      error?.message || "Unable to sync Instagram statistics",
    );
  }
};

/* ================================================================
   DELETE SOCIAL ACCOUNT
================================================================ */

export const deleteSocialAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    const { accountId } = req.params;

    if (!userId) {
      return response(res, 401, "Unauthorized");
    }

    const account = await SocialAccount.findOneAndDelete({
      _id: accountId,
      user: userId,
    });

    if (!account) {
      return response(res, 404, "Social account not found");
    }

    return response(res, 200, "Social account disconnected successfully");
  } catch (error) {
    console.error("DELETE SOCIAL ACCOUNT ERROR:", error);

    return response(res, 500, "Unable to disconnect social account");
  }
};
