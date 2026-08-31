"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logisticsService = void 0;
const LogisticsService_1 = require("./LogisticsService");
const LogisticsProviderRegistry_1 = require("./LogisticsProviderRegistry");
const providers = (0, LogisticsProviderRegistry_1.createLogisticsProviders)();
exports.logisticsService = new LogisticsService_1.LogisticsService(providers);
