import { LogisticsService } from "./LogisticsService";
import { createLogisticsProviders } from "./LogisticsProviderRegistry";

const providers = createLogisticsProviders();

export const logisticsService = new LogisticsService(providers);
