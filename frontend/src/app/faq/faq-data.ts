export type FAQ = {
  question: string;
  answer: string;
  category: string;
};

export const FAQS: FAQ[] = [
  // =========================================================
  // GENERAL
  // =========================================================
  {
    category: "General",
    question: "What is MYSMME?",
    answer:
      "MYSMME is an independent online e-commerce marketplace where customers can discover and shop for sarees, ethnic wear, fashion, lifestyle products and other products offered by participating sellers.",
  },
  {
    category: "General",
    question: "Is MYSMME a saree marketplace?",
    answer:
      "Yes. Sarees are an important part of the MYSMME marketplace. Customers can discover sarees and other traditional, ethnic and fashion products from participating sellers.",
  },
  {
    category: "General",
    question: "Is MYSMME an online shopping website?",
    answer:
      "Yes. MYSMME provides an online marketplace where shoppers can browse products, discover sellers and purchase products available on the platform.",
  },
  {
    category: "General",
    question: "What products can I find on MYSMME?",
    answer:
      "Depending on the categories and sellers available on the platform, MYSMME may offer sarees, ethnic wear, women's fashion, men's fashion, kids' fashion, accessories, lifestyle products and other marketplace products.",
  },
  {
    category: "General",
    question: "Who is MYSMME for?",
    answer:
      "MYSMME is built for both sides of the marketplace: customers looking to discover and purchase products, and sellers or businesses looking to showcase their products online.",
  },

  // =========================================================
  // MSME CLARIFICATION
  // =========================================================
  {
    category: "MYSMME vs MSME",
    question: "Is MYSMME related to MSME (Ministry of MSME)?",
    answer:
      "No. MYSMME is not the Ministry of MSME, is not a government department and is not an official Government of India MSME portal. MYSMME is an independent e-commerce marketplace focused on sarees, fashion, lifestyle and other products. The names MYSMME and MSME may look similar, but they refer to different things.",
  },
  {
    category: "MYSMME vs MSME",
    question: "Is MYSMME affiliated with the Government of India?",
    answer:
      "No. MYSMME is an independent e-commerce marketplace and should not be considered a Government of India website, ministry, department or official government portal.",
  },
  {
    category: "MYSMME vs MSME",
    question: "Is MYSMME the official MSME website?",
    answer:
      "No. MYSMME is not the official website of the Ministry of Micro, Small & Medium Enterprises. MYSMME is a private online marketplace for shopping and selling products.",
  },
  {
    category: "MYSMME vs MSME",
    question: "What does MSME mean?",
    answer:
      "MSME stands for Micro, Small and Medium Enterprises. In India, the term is also associated with the Government of India's Ministry of Micro, Small & Medium Enterprises.",
  },
  {
    category: "MYSMME vs MSME",
    question: "Why does MYSMME sound similar to MSME?",
    answer:
      "The names can look or sound similar when searched online, which can naturally create confusion. However, MYSMME and MSME are separate. MYSMME is an e-commerce marketplace, while MSME refers to Micro, Small and Medium Enterprises and the government ministry associated with MSME-related policies and programmes.",
  },

  // =========================================================
  // SHOPPING
  // =========================================================
  {
    category: "Shopping",
    question: "How can I shop on MYSMME?",
    answer:
      "Browse the available products, explore categories or use search to find something you like. Open a product listing to review its details and then follow the available checkout process to place your order.",
  },
  {
    category: "Shopping",
    question: "How do I find a saree on MYSMME?",
    answer:
      "You can use the search functionality, browse relevant categories or explore the saree products available on the marketplace. Product filters may also be available depending on the category.",
  },
  {
    category: "Shopping",
    question: "Can I search for products by category?",
    answer:
      "Yes. MYSMME is designed to help shoppers discover products through categories, search and other available marketplace navigation features.",
  },
  {
    category: "Shopping",
    question: "Can I compare products from different sellers?",
    answer:
      "Where product information is available, you can review listings from different sellers and compare relevant details such as product description, pricing, images and other information shown on the marketplace.",
  },
  {
    category: "Shopping",
    question: "How do I know the product size or dimensions?",
    answer:
      "Product-specific size, measurements and specifications should be checked on the individual product listing. Available information can vary depending on the product and seller.",
  },
  {
    category: "Shopping",
    question: "Are product images accurate?",
    answer:
      "Product images are provided to help customers understand the appearance of an item. Colours and appearance may vary slightly because of photography, lighting and individual screen settings.",
  },

  // =========================================================
  // ORDERS
  // =========================================================
  {
    category: "Orders",
    question: "How do I place an order?",
    answer:
      "Select a product you want to purchase, review the available product information, add it to your cart where applicable and follow the instructions shown during checkout.",
  },
  {
    category: "Orders",
    question: "Do I need an account to place an order?",
    answer:
      "Account requirements may depend on the checkout flow available on MYSMME. If an account is required, you can register or sign in using the options provided on the platform.",
  },
  {
    category: "Orders",
    question: "Where can I see my order details?",
    answer:
      "If order management is available through your MYSMME account, you can sign in and review your order information. Order-related information may also be provided through your registered contact details.",
  },
  {
    category: "Orders",
    question: "Can I cancel my order?",
    answer:
      "Cancellation depends on the order status and the applicable cancellation policy. If cancellation is available for your order, follow the cancellation instructions provided through the platform.",
  },
  {
    category: "Orders",
    question: "What should I do if I receive the wrong product?",
    answer:
      "Contact MYSMME support as soon as possible with your order details and information about the issue. You may be asked to provide photographs or other relevant evidence.",
  },

  // =========================================================
  // PAYMENTS
  // =========================================================
  {
    category: "Payments",
    question: "What payment methods are available?",
    answer:
      "Available payment methods can vary. The payment options displayed during checkout are the methods currently available for the applicable order.",
  },
  {
    category: "Payments",
    question: "Is online payment secure?",
    answer:
      "MYSMME takes reasonable measures to support secure transactions and protect customer information. Customers should also keep passwords, OTPs and payment credentials private.",
  },
  {
    category: "Payments",
    question: "Will I receive payment confirmation?",
    answer:
      "Payment and order confirmation information may be provided through the checkout process or the contact details associated with your order.",
  },
  {
    category: "Payments",
    question: "What happens if my payment fails?",
    answer:
      "If a payment does not complete successfully, check the payment status before trying again. If an amount has been debited but the order was not successfully placed, contact the relevant support team with your transaction and order information.",
  },

  // =========================================================
  // DELIVERY
  // =========================================================
  {
    category: "Delivery",
    question: "Does MYSMME offer delivery?",
    answer:
      "Delivery availability depends on the product, seller, destination and applicable shipping arrangements.",
  },
  {
    category: "Delivery",
    question: "How long does delivery take?",
    answer:
      "Delivery times can vary based on product availability, seller location, destination, shipping method and other logistical factors. The estimated delivery information shown during shopping or checkout should be used as the primary reference.",
  },
  {
    category: "Delivery",
    question: "Can I track my order?",
    answer:
      "Where shipment tracking is available, tracking information may be provided after your order has been shipped.",
  },
  {
    category: "Delivery",
    question: "Does MYSMME deliver across India?",
    answer:
      "Delivery coverage may vary by product and seller. Enter your delivery location during shopping or checkout to determine whether delivery is available for a particular product.",
  },
  {
    category: "Delivery",
    question: "What should I do if my order is delayed?",
    answer:
      "Check your latest order or shipment information first. If the order has exceeded the estimated delivery period, contact MYSMME support with your order details.",
  },

  // =========================================================
  // RETURNS
  // =========================================================
  {
    category: "Returns & Refunds",
    question: "Can I return a product?",
    answer:
      "Return eligibility depends on the product, seller and applicable MYSMME return policy. Check the return information associated with the specific product before placing an order.",
  },
  {
    category: "Returns & Refunds",
    question: "How do I request a return?",
    answer:
      "Follow the return instructions provided with your order or through your MYSMME account, where available. You may need to provide order information and details about the reason for the return.",
  },
  {
    category: "Returns & Refunds",
    question: "When will I receive my refund?",
    answer:
      "Refund processing times can vary depending on the reason for the refund, order status, payment method, seller and applicable refund policy.",
  },
  {
    category: "Returns & Refunds",
    question: "What if my product arrives damaged?",
    answer:
      "Contact MYSMME support as soon as possible and provide your order details along with information about the damage. Photographs may be requested where appropriate.",
  },

  // =========================================================
  // SELLERS
  // =========================================================
  {
    category: "Selling",
    question: "Can I sell products on MYSMME?",
    answer:
      "Yes. MYSMME is designed as a marketplace that allows participating sellers and businesses to showcase products and reach customers online, subject to the platform's seller requirements.",
  },
  {
    category: "Selling",
    question: "Can small businesses sell on MYSMME?",
    answer:
      "Yes. MYSMME is intended to provide sellers and businesses with an online marketplace where they can showcase products and build their presence.",
  },
  {
    category: "Selling",
    question: "How do I become a seller?",
    answer:
      "Start by registering through the seller or registration options available on MYSMME. Follow the onboarding instructions and provide the required business and account information.",
  },
  {
    category: "Selling",
    question: "What can sellers do on MYSMME?",
    answer:
      "Depending on the seller features available to your account, sellers can create a profile, add and manage products, maintain catalogue information, receive orders and manage marketplace activity.",
  },
  {
    category: "Selling",
    question: "Can sellers manage their products online?",
    answer:
      "MYSMME is designed to provide sellers with tools for managing their marketplace product catalogue, including product information, images and pricing where applicable.",
  },
  {
    category: "Selling",
    question: "Can sellers manage orders?",
    answer:
      "Yes. Seller functionality can include receiving and managing incoming orders and carrying out the activities required to fulfil those orders.",
  },

  // =========================================================
  // ACCOUNT
  // =========================================================
  {
    category: "Account",
    question: "How do I create a MYSMME account?",
    answer:
      "Use the registration option available on the MYSMME website and follow the instructions to create your account.",
  },
  {
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "Use the password recovery or reset option available on the MYSMME login page and follow the instructions provided.",
  },
  {
    category: "Account",
    question: "Can I update my account information?",
    answer:
      "Where account-management features are available, you can update relevant information through your account settings. Some information may require additional verification.",
  },
  {
    category: "Account",
    question: "How can I contact MYSMME?",
    answer:
      "For questions about orders, products, accounts, sellers, returns or other marketplace matters, use the customer-support or contact options available on the MYSMME website.",
  },

  // =========================================================
  // PRIVACY
  // =========================================================
  {
    category: "Privacy & Security",
    question: "How does MYSMME use my information?",
    answer:
      "MYSMME may collect and process information necessary to provide website, marketplace, account, order, payment, customer-support and related services. Please review the Privacy Policy for detailed information.",
  },
  {
    category: "Privacy & Security",
    question: "Does MYSMME share my personal information?",
    answer:
      "Information may be shared with relevant service providers, sellers, logistics partners, payment providers or other parties where necessary to provide marketplace services and as described in the applicable Privacy Policy.",
  },
  {
    category: "Privacy & Security",
    question: "Where can I read the MYSMME Privacy Policy?",
    answer:
      "You can read the MYSMME Privacy Policy to understand how information is collected, used and handled on the platform.",
  },
];

export const CATEGORIES = [
  "All",
  "General",
  "Shopping",
  "Orders",
  "Payments",
  "Delivery",
  "Returns & Refunds",
  "Selling",
  "Account",
  "Privacy & Security",
  "MYSMME vs MSME",
];
