"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductImportTemplate = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const RED = "DC2626";
const DARK = "0F172A";
const BORDER = "CBD5E1";
const LIGHT_GRAY = "F8FAFC";
const REQUIRED_HEADERS = new Set([
    "productId",
    "skuId",
    "title",
    "description",
    "brand",
    "category",
    "color",
    "season",
    "gender",
    "price",
    "finalPrice",
    "mrp",
    "gstPercentage",
    "netQuantity",
    "inventory",
    "image1",
    "image2",
    "image3",
]);
// ============================================================
// MAIN GENERATOR
// ============================================================
const generateProductImportTemplate = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
    var _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31;
    const workbook = new exceljs_1.default.Workbook();
    workbook.creator = "Catalogue Admin";
    workbook.lastModifiedBy = "Catalogue Admin";
    workbook.created = new Date();
    workbook.modified = new Date();
    // ============================================================
    // SHEETS
    // ============================================================
    const instructions = workbook.addWorksheet("Instructions");
    const worksheet = workbook.addWorksheet("Saree-Fill-This");
    const systemData = workbook.addWorksheet("System-Data");
    // Keep system data hidden
    systemData.state = "veryHidden";
    // ============================================================
    // MAIN PRODUCT COLUMNS
    // ============================================================
    const columns = [
        { key: "productId", header: "productId", width: 20 },
        { key: "skuId", header: "skuId", width: 20 },
        { key: "groupId", header: "groupId", width: 20 },
        { key: "title", header: "title", width: 32 },
        { key: "description", header: "description", width: 55 },
        { key: "brand", header: "brand", width: 25 },
        { key: "category", header: "category", width: 25 },
        { key: "color", header: "color", width: 20 },
        { key: "season", header: "season", width: 20 },
        { key: "gender", header: "gender", width: 15 },
        { key: "collectionName", header: "collectionName", width: 25 },
        { key: "price", header: "price", width: 15 },
        { key: "finalPrice", header: "finalPrice", width: 15 },
        { key: "mrp", header: "mrp", width: 15 },
        { key: "gstPercentage", header: "gstPercentage", width: 18 },
        { key: "hsnId", header: "hsnId", width: 15 },
        { key: "netWeight", header: "netWeight", width: 15 },
        { key: "netQuantity", header: "netQuantity", width: 15 },
        { key: "countryOfOrigin", header: "countryOfOrigin", width: 20 },
        { key: "genericName", header: "genericName", width: 20 },
        { key: "inventory", header: "inventory", width: 15 },
        { key: "manufacturerName", header: "manufacturerName", width: 28 },
        {
            key: "manufacturerAddress",
            header: "manufacturerAddress",
            width: 40,
        },
        {
            key: "manufacturerPincode",
            header: "manufacturerPincode",
            width: 20,
        },
        { key: "packerName", header: "packerName", width: 28 },
        { key: "packerAddress", header: "packerAddress", width: 40 },
        { key: "packerPincode", header: "packerPincode", width: 20 },
        { key: "importerName", header: "importerName", width: 28 },
        { key: "importerAddress", header: "importerAddress", width: 40 },
        { key: "importerPincode", header: "importerPincode", width: 20 },
        { key: "blouse", header: "blouse", width: 20 },
        { key: "blouseColor", header: "blouseColor", width: 20 },
        { key: "blouseFabric", header: "blouseFabric", width: 20 },
        { key: "blousePattern", header: "blousePattern", width: 20 },
        { key: "blouseLengthSize", header: "blouseLengthSize", width: 20 },
        { key: "border", header: "border", width: 25 },
        { key: "borderWidth", header: "borderWidth", width: 18 },
        { key: "colorRemarks", header: "colorRemarks", width: 30 },
        {
            key: "printOrPatternType",
            header: "printOrPatternType",
            width: 25,
        },
        { key: "pattern", header: "pattern", width: 25 },
        { key: "sareeFabric", header: "sareeFabric", width: 25 },
        { key: "sareeLengthSize", header: "sareeLengthSize", width: 20 },
        { key: "transparency", header: "transparency", width: 25 },
        { key: "type", header: "type", width: 20 },
        { key: "loomType", header: "loomType", width: 20 },
        { key: "occasion", header: "occasion", width: 25 },
        { key: "ornamentation", header: "ornamentation", width: 25 },
        { key: "palluDetails", header: "palluDetails", width: 30 },
        { key: "tags", header: "tags", width: 40 },
        { key: "rejectionReason", header: "rejectionReason", width: 35 },
        { key: "image1", header: "image1", width: 60 },
        { key: "image2", header: "image2", width: 60 },
        { key: "image3", header: "image3", width: 60 },
        { key: "image4", header: "image4", width: 60 },
        { key: "image5", header: "image5", width: 60 },
    ];
    worksheet.columns = columns;
    // ============================================================
    // HEADER
    // ============================================================
    const headerRow = worksheet.getRow(1);
    headerRow.height = 32;
    headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
    };
    headerRow.eachCell((cell) => {
        cell.border = {
            top: {
                style: "thin",
                color: { argb: BORDER },
            },
            bottom: {
                style: "thin",
                color: { argb: BORDER },
            },
            left: {
                style: "thin",
                color: { argb: BORDER },
            },
            right: {
                style: "thin",
                color: { argb: BORDER },
            },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: RED },
        };
        cell.font = {
            bold: true,
            color: { argb: "FFFFFF" },
            size: 11,
        };
    });
    // Required headers
    columns.forEach((column, index) => {
        const cell = worksheet.getCell(1, index + 1);
        const REQUIRED_GREEN = "16A34A";
        if (REQUIRED_HEADERS.has(column.key)) {
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: REQUIRED_GREEN },
            };
            cell.font = {
                bold: true,
                color: { argb: "FFFFFF" },
                size: 11,
            };
        }
    });
    // ============================================================
    // EXAMPLE DATA
    // ============================================================
    const firstPrintType = getFirstAttribute(options.attributes, "printOrPatternType");
    const firstPattern = getFirstAttribute(options.attributes, "pattern");
    const firstBlousePattern = getFirstAttribute(options.attributes, "blousePattern");
    const firstBlouseFabric = getFirstAttribute(options.attributes, "blouseFabric");
    const firstSareeFabric = getFirstAttribute(options.attributes, "sareeFabric");
    const firstType = getFirstAttribute(options.attributes, "type");
    const firstBorder = getFirstAttribute(options.attributes, "border");
    const firstOrnamentation = getFirstAttribute(options.attributes, "ornamentation");
    const firstPalluDetails = getFirstAttribute(options.attributes, "palluDetails");
    const firstOccasion = getFirstAttribute(options.attributes, "occasion");
    const firstTransparency = getFirstAttribute(options.attributes, "transparency");
    const firstLoomType = getFirstAttribute(options.attributes, "loomType");
    worksheet.addRow({
        title: "Banarasi Silk Saree",
        description: "Traditional Banarasi silk saree with zari work suitable for weddings and festive occasions.",
        brand: (_3 = (_b = (_a = options.brands) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name) !== null && _3 !== void 0 ? _3 : "",
        category: (_4 = (_d = (_c = options.categories) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.name) !== null && _4 !== void 0 ? _4 : "",
        color: (_5 = (_f = (_e = options.colors) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.name) !== null && _5 !== void 0 ? _5 : "",
        season: (_6 = (_h = (_g = options.seasons) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.name) !== null && _6 !== void 0 ? _6 : "",
        gender: "Womens",
        collectionName: "Festive Collection",
        price: 5999,
        finalPrice: 5499,
        mrp: 6999,
        gstPercentage: (_7 = (_k = (_j = options.gsts) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.percentage) !== null && _7 !== void 0 ? _7 : "",
        hsnId: "5007",
        netWeight: 650,
        netQuantity: 1,
        countryOfOrigin: "India",
        genericName: "Saree",
        inventory: 10,
        manufacturerName: "Example Manufacturer",
        manufacturerAddress: "Surat, Gujarat, India",
        manufacturerPincode: "395003",
        packerName: "Example Packer",
        packerAddress: "Surat, Gujarat, India",
        packerPincode: "395003",
        importerName: "",
        importerAddress: "",
        importerPincode: "",
        blouse: "Unstitched",
        // IMPORTANT:
        // blouseColor uses the SAME colors list
        // as the main color field.
        blouseColor: (_8 = (_m = (_l = options.colors) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.name) !== null && _8 !== void 0 ? _8 : "",
        blouseFabric: (_9 = firstBlouseFabric === null || firstBlouseFabric === void 0 ? void 0 : firstBlouseFabric.value) !== null && _9 !== void 0 ? _9 : "",
        blousePattern: (_10 = firstBlousePattern === null || firstBlousePattern === void 0 ? void 0 : firstBlousePattern.value) !== null && _10 !== void 0 ? _10 : "",
        blouseLengthSize: 0.8,
        border: (_11 = firstBorder === null || firstBorder === void 0 ? void 0 : firstBorder.value) !== null && _11 !== void 0 ? _11 : "",
        borderWidth: 3,
        colorRemarks: "Deep red with golden zari",
        printOrPatternType: (_12 = firstPrintType === null || firstPrintType === void 0 ? void 0 : firstPrintType.value) !== null && _12 !== void 0 ? _12 : "",
        pattern: (_13 = firstPattern === null || firstPattern === void 0 ? void 0 : firstPattern.value) !== null && _13 !== void 0 ? _13 : "",
        sareeFabric: (_14 = firstSareeFabric === null || firstSareeFabric === void 0 ? void 0 : firstSareeFabric.value) !== null && _14 !== void 0 ? _14 : "",
        sareeLengthSize: 5.5,
        transparency: (_15 = firstTransparency === null || firstTransparency === void 0 ? void 0 : firstTransparency.value) !== null && _15 !== void 0 ? _15 : "",
        type: (_16 = firstType === null || firstType === void 0 ? void 0 : firstType.value) !== null && _16 !== void 0 ? _16 : "",
        loomType: (_17 = firstLoomType === null || firstLoomType === void 0 ? void 0 : firstLoomType.value) !== null && _17 !== void 0 ? _17 : "",
        occasion: (_18 = firstOccasion === null || firstOccasion === void 0 ? void 0 : firstOccasion.value) !== null && _18 !== void 0 ? _18 : "",
        ornamentation: (_19 = firstOrnamentation === null || firstOrnamentation === void 0 ? void 0 : firstOrnamentation.value) !== null && _19 !== void 0 ? _19 : "",
        palluDetails: (_20 = firstPalluDetails === null || firstPalluDetails === void 0 ? void 0 : firstPalluDetails.value) !== null && _20 !== void 0 ? _20 : "",
        productId: "PROD-001",
        skuId: "SKU-001",
        groupId: "GROUP-001",
        tags: "silk,wedding,banarasi,festive",
        rejectionReason: "",
        image1: "https://example.com/image1.jpg",
        image2: "https://example.com/image2.jpg",
        image3: "https://example.com/image3.jpg",
        image4: "https://example.com/image4.jpg",
        image5: "https://example.com/image5.jpg",
    });
    // ============================================================
    // EXAMPLE ROW STYLE
    // ============================================================
    const exampleRow = worksheet.getRow(2);
    exampleRow.font = {
        color: { argb: "475569" },
        italic: true,
    };
    exampleRow.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: LIGHT_GRAY },
        };
    });
    exampleRow.alignment = {
        vertical: "top",
        wrapText: true,
    };
    // ============================================================
    // FREEZE HEADER
    // ============================================================
    worksheet.views = [
        {
            state: "frozen",
            ySplit: 1,
            xSplit: 0,
        },
    ];
    // ============================================================
    // SYSTEM DATA
    // ============================================================
    /*
     * System-Data
     *
     * A = Brands
     * B = Categories
     * C = Colors
     * D = Seasons
     * E = GST
     *
     * G onward = attributes grouped by type.
     */
    systemData.getCell("A1").value = "Brands";
    systemData.getCell("B1").value = "Categories";
    systemData.getCell("C1").value = "Colors";
    systemData.getCell("D1").value = "Seasons";
    systemData.getCell("E1").value = "GST";
    styleSystemHeader(systemData.getRow(1));
    // ============================================================
    // BASIC LIST DATA
    // ============================================================
    const brandCount = (_21 = (_o = options.brands) === null || _o === void 0 ? void 0 : _o.length) !== null && _21 !== void 0 ? _21 : 0;
    const categoryCount = (_22 = (_p = options.categories) === null || _p === void 0 ? void 0 : _p.length) !== null && _22 !== void 0 ? _22 : 0;
    const colorCount = (_23 = (_q = options.colors) === null || _q === void 0 ? void 0 : _q.length) !== null && _23 !== void 0 ? _23 : 0;
    const seasonCount = (_24 = (_r = options.seasons) === null || _r === void 0 ? void 0 : _r.length) !== null && _24 !== void 0 ? _24 : 0;
    const gstCount = (_25 = (_s = options.gsts) === null || _s === void 0 ? void 0 : _s.length) !== null && _25 !== void 0 ? _25 : 0;
    const maxLength = Math.max(brandCount, categoryCount, colorCount, seasonCount, gstCount);
    for (let i = 0; i < maxLength; i++) {
        systemData.getCell(i + 2, 1).value = (_26 = (_u = (_t = options.brands) === null || _t === void 0 ? void 0 : _t[i]) === null || _u === void 0 ? void 0 : _u.name) !== null && _26 !== void 0 ? _26 : "";
        systemData.getCell(i + 2, 2).value = (_27 = (_w = (_v = options.categories) === null || _v === void 0 ? void 0 : _v[i]) === null || _w === void 0 ? void 0 : _w.name) !== null && _27 !== void 0 ? _27 : "";
        systemData.getCell(i + 2, 3).value = (_28 = (_y = (_x = options.colors) === null || _x === void 0 ? void 0 : _x[i]) === null || _y === void 0 ? void 0 : _y.name) !== null && _28 !== void 0 ? _28 : "";
        systemData.getCell(i + 2, 4).value = (_29 = (_0 = (_z = options.seasons) === null || _z === void 0 ? void 0 : _z[i]) === null || _0 === void 0 ? void 0 : _0.name) !== null && _29 !== void 0 ? _29 : "";
        systemData.getCell(i + 2, 5).value = (_30 = (_2 = (_1 = options.gsts) === null || _1 === void 0 ? void 0 : _1[i]) === null || _2 === void 0 ? void 0 : _2.percentage) !== null && _30 !== void 0 ? _30 : "";
    }
    // ============================================================
    // ATTRIBUTE DATA
    // ============================================================
    const activeAttributes = ((_31 = options.attributes) !== null && _31 !== void 0 ? _31 : [])
        .filter((attribute) => attribute.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    /*
     * We deliberately make one simple list for every attribute
     * type.
     *
     * Example:
     *
     * G = printOrPatternType
     * H = pattern
     * I = blousePattern
     * J = blouseFabric
     * etc.
     *
     * This avoids INDIRECT/dependent dropdown problems.
     */
    const attributeTypes = Array.from(new Set(activeAttributes.map((attribute) => attribute.type)));
    const attributeColumnMap = new Map();
    let nextAttributeColumn = 7; // G
    for (const attributeType of attributeTypes) {
        const columnNumber = nextAttributeColumn++;
        attributeColumnMap.set(attributeType, columnNumber);
        systemData.getCell(1, columnNumber).value = attributeType;
        const typeAttributes = activeAttributes
            .filter((attribute) => attribute.type === attributeType)
            .sort((a, b) => a.sortOrder - b.sortOrder);
        typeAttributes.forEach((attribute, index) => {
            systemData.getCell(index + 2, columnNumber).value = attribute.value;
        });
        systemData.getColumn(columnNumber).width = 35;
    }
    // Style all system headers
    styleSystemHeader(systemData.getRow(1));
    // ============================================================
    // SYSTEM COLUMN WIDTHS
    // ============================================================
    systemData.getColumn(1).width = 35;
    systemData.getColumn(2).width = 35;
    systemData.getColumn(3).width = 35;
    systemData.getColumn(4).width = 35;
    systemData.getColumn(5).width = 15;
    // ============================================================
    // GST NAMED RANGE
    // ============================================================
    if (gstCount > 0) {
        workbook.definedNames.add(`'System-Data'!$E$2:$E$${gstCount + 1}`, "GSTList");
    }
    // ============================================================
    // ATTRIBUTE NAMED RANGES
    // ============================================================
    for (const attributeType of attributeTypes) {
        const columnNumber = attributeColumnMap.get(attributeType);
        if (!columnNumber) {
            continue;
        }
        const count = activeAttributes.filter((attribute) => attribute.type === attributeType).length;
        if (count === 0) {
            continue;
        }
        const columnLetter = getColumnLetter(columnNumber);
        const range = `'System-Data'!$${columnLetter}$2:$${columnLetter}$${count + 1}`;
        const rangeName = getAttributeTypeNamedRangeName(attributeType);
        workbook.definedNames.add(range, rangeName);
    }
    // ============================================================
    // DROPDOWN RANGE
    // ============================================================
    const START_ROW = 2;
    const END_ROW = 1001;
    // ============================================================
    // BRAND
    // ============================================================
    const brandColumn = getColumnIndex(columns, "brand");
    if (brandColumn !== -1 && brandCount > 0) {
        applyDropdown(worksheet, brandColumn + 1, START_ROW, END_ROW, `'System-Data'!$A$2:$A$${brandCount + 1}`);
    }
    // ============================================================
    // CATEGORY
    // ============================================================
    const categoryColumn = getColumnIndex(columns, "category");
    if (categoryColumn !== -1 && categoryCount > 0) {
        applyDropdown(worksheet, categoryColumn + 1, START_ROW, END_ROW, `'System-Data'!$B$2:$B$${categoryCount + 1}`);
    }
    // ============================================================
    // COLOR
    // ============================================================
    const colorColumn = getColumnIndex(columns, "color");
    if (colorColumn !== -1 && colorCount > 0) {
        applyDropdown(worksheet, colorColumn + 1, START_ROW, END_ROW, `'System-Data'!$C$2:$C$${colorCount + 1}`);
    }
    // ============================================================
    // BLOUSE COLOR
    // ============================================================
    /*
     * IMPORTANT:
     *
     * blouseColor uses exactly the same color list as color.
     *
     * Therefore if:
     *
     * color = Red, Blue, Green
     *
     * blouseColor =
     * Red, Blue, Green
     */
    const blouseColorColumn = getColumnIndex(columns, "blouseColor");
    if (blouseColorColumn !== -1 && colorCount > 0) {
        applyDropdown(worksheet, blouseColorColumn + 1, START_ROW, END_ROW, `'System-Data'!$C$2:$C$${colorCount + 1}`);
    }
    // ============================================================
    // SEASON
    // ============================================================
    const seasonColumn = getColumnIndex(columns, "season");
    if (seasonColumn !== -1 && seasonCount > 0) {
        applyDropdown(worksheet, seasonColumn + 1, START_ROW, END_ROW, `'System-Data'!$D$2:$D$${seasonCount + 1}`);
    }
    // ============================================================
    // GST
    // ============================================================
    const gstColumn = getColumnIndex(columns, "gstPercentage");
    if (gstColumn !== -1 && gstCount > 0) {
        applyNamedRangeDropdown(worksheet, gstColumn + 1, START_ROW, END_ROW, "GSTList", "Invalid GST", "Please select a GST percentage from the dropdown.");
    }
    // ============================================================
    // GENDER
    // ============================================================
    const genderColumn = getColumnIndex(columns, "gender");
    if (genderColumn !== -1) {
        applyListDropdown(worksheet, genderColumn + 1, START_ROW, END_ROW, "Womens,Unisex", false);
    }
    // ============================================================
    // ALL ATTRIBUTE DROPDOWNS
    // ============================================================
    /*
     * SIMPLE IMPLEMENTATION
     *
     * Every attribute column gets a dropdown from its own
     * attribute type.
     *
     * pattern      -> all active pattern values
     * blousePattern -> all active blousePattern values
     * blouseFabric  -> all active blouseFabric values
     * sareeFabric   -> all active sareeFabric values
     * etc.
     *
     * parentId is intentionally ignored for Excel dropdown
     * generation.
     *
     * This makes pattern behave exactly like the other fields.
     */
    for (const attributeType of attributeTypes) {
        const columnIndex = getColumnIndex(columns, attributeType);
        if (columnIndex === -1) {
            continue;
        }
        const count = activeAttributes.filter((attribute) => attribute.type === attributeType).length;
        if (count === 0) {
            continue;
        }
        const namedRange = getAttributeTypeNamedRangeName(attributeType);
        applyNamedRangeDropdown(worksheet, columnIndex + 1, START_ROW, END_ROW, namedRange, `Invalid ${attributeType}`, `Please select a valid ${attributeType} from the dropdown.`);
    }
    // ============================================================
    // AUTO FILTER
    // ============================================================
    worksheet.autoFilter = {
        from: "A1",
        to: `${getColumnLetter(columns.length)}2`,
    };
    // ============================================================
    // INSTRUCTIONS
    // ============================================================
    createInstructionsSheet(instructions);
    return workbook;
});
exports.generateProductImportTemplate = generateProductImportTemplate;
// ============================================================
// GET FIRST ATTRIBUTE
// ============================================================
function getFirstAttribute(attributes, type) {
    return (attributes !== null && attributes !== void 0 ? attributes : [])
        .filter((attribute) => attribute.isActive && attribute.type === type)
        .sort((a, b) => a.sortOrder - b.sortOrder)[0];
}
// ============================================================
// ATTRIBUTE TYPE NAMED RANGE
// ============================================================
function getAttributeTypeNamedRangeName(type) {
    return `ATTR_${sanitizeForExcelName(type)}`.toUpperCase();
}
// ============================================================
// SANITIZE EXCEL NAME
// ============================================================
function sanitizeForExcelName(value) {
    let result = value
        .trim()
        .replace(/[^A-Za-z0-9_]/g, "_")
        .replace(/_+/g, "_");
    if (!result) {
        result = "VALUE";
    }
    // Excel named ranges cannot start with a number.
    if (/^[0-9]/.test(result)) {
        result = `V_${result}`;
    }
    return result;
}
// ============================================================
// FIND COLUMN INDEX
// ============================================================
function getColumnIndex(columns, key) {
    return columns.findIndex((column) => column.key === key);
}
// ============================================================
// NORMAL RANGE DROPDOWN
// ============================================================
function applyDropdown(worksheet, columnNumber, startRow, endRow, range) {
    for (let row = startRow; row <= endRow; row++) {
        worksheet.getCell(row, columnNumber).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [range],
            showErrorMessage: true,
            errorStyle: "stop",
            errorTitle: "Invalid value",
            error: "Please select a value from the system list.",
        };
    }
}
// ============================================================
// NAMED RANGE DROPDOWN
// ============================================================
function applyNamedRangeDropdown(worksheet, columnNumber, startRow, endRow, namedRange, errorTitle, errorMessage) {
    for (let row = startRow; row <= endRow; row++) {
        worksheet.getCell(row, columnNumber).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`=${namedRange}`],
            showErrorMessage: true,
            errorStyle: "stop",
            errorTitle,
            error: errorMessage,
        };
    }
}
// ============================================================
// INLINE LIST DROPDOWN
// ============================================================
function applyListDropdown(worksheet, columnNumber, startRow, endRow, values, allowBlank = false) {
    for (let row = startRow; row <= endRow; row++) {
        worksheet.getCell(row, columnNumber).dataValidation = {
            type: "list",
            allowBlank,
            formulae: [`"${values}"`],
            showErrorMessage: true,
            errorStyle: "stop",
            errorTitle: "Invalid value",
            error: "Please select a value from the dropdown.",
        };
    }
}
// ============================================================
// SYSTEM HEADER
// ============================================================
function styleSystemHeader(row) {
    row.font = {
        bold: true,
        color: {
            argb: "FFFFFF",
        },
    };
    row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: RED,
        },
    };
}
// ============================================================
// COLUMN LETTER
// ============================================================
function getColumnLetter(columnNumber) {
    let result = "";
    let number = columnNumber;
    while (number > 0) {
        const remainder = (number - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        number = Math.floor((number - 1) / 26);
    }
    return result;
}
// ============================================================
// INSTRUCTIONS SHEET
// ============================================================
function createInstructionsSheet(worksheet) {
    worksheet.columns = [
        {
            key: "field",
            header: "Field",
            width: 30,
        },
        {
            key: "description",
            header: "Description",
            width: 75,
        },
        {
            key: "required",
            header: "Required",
            width: 15,
        },
    ];
    // ============================================================
    // VERSION
    // ============================================================
    worksheet.mergeCells("A1:C1");
    const versionCell = worksheet.getCell("A1");
    versionCell.value = "VERSION-1.0";
    versionCell.font = {
        bold: true,
        color: {
            argb: "FFFFFF",
        },
        size: 14,
    };
    versionCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: DARK,
        },
    };
    versionCell.alignment = {
        vertical: "middle",
        horizontal: "left",
    };
    worksheet.getRow(1).height = 30;
    // ============================================================
    // HEADER
    // ============================================================
    const header = worksheet.getRow(2);
    header.values = ["Field", "Description", "Required"];
    header.height = 28;
    header.font = {
        bold: true,
        color: {
            argb: "FFFFFF",
        },
    };
    header.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: RED,
        },
    };
    header.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
    };
    header.eachCell((cell) => {
        cell.border = {
            top: {
                style: "thin",
                color: {
                    argb: BORDER,
                },
            },
            bottom: {
                style: "thin",
                color: {
                    argb: BORDER,
                },
            },
            left: {
                style: "thin",
                color: {
                    argb: BORDER,
                },
            },
            right: {
                style: "thin",
                color: {
                    argb: BORDER,
                },
            },
        };
    });
    // ============================================================
    // INSTRUCTIONS
    // ============================================================
    const instructions = [
        {
            field: "title",
            description: "Product title.",
            required: "YES",
        },
        {
            field: "description",
            description: "Detailed product description.",
            required: "YES",
        },
        {
            field: "brand",
            description: "Select a brand from the dropdown. Brands are controlled by the system.",
            required: "YES",
        },
        {
            field: "category",
            description: "Select a category from the dropdown. Categories are controlled by the system.",
            required: "YES",
        },
        {
            field: "color",
            description: "Select a color from the system color dropdown.",
            required: "YES",
        },
        {
            field: "season",
            description: "Select a season from the dropdown.",
            required: "YES",
        },
        {
            field: "gender",
            description: "Allowed values: Womens or Unisex.",
            required: "YES",
        },
        {
            field: "price",
            description: "Regular selling price.",
            required: "YES",
        },
        {
            field: "finalPrice",
            description: "Final selling price. Must not exceed price.",
            required: "YES",
        },
        {
            field: "mrp",
            description: "Maximum retail price. Must be >= price.",
            required: "YES",
        },
        {
            field: "gstPercentage",
            description: "Select GST percentage from the GST dropdown.",
            required: "YES",
        },
        {
            field: "netQuantity",
            description: "Product quantity. Must be at least 1.",
            required: "YES",
        },
        {
            field: "inventory",
            description: "Current inventory quantity.",
            required: "YES",
        },
        {
            field: "seller",
            description: "Seller MongoDB ID.",
            required: "YES",
        },
        {
            field: "blouseColor",
            description: "Select blouse color from the same system-controlled color list used by the color field.",
            required: "NO",
        },
        {
            field: "printOrPatternType",
            description: "Select a print or pattern type from the system attribute list.",
            required: "NO",
        },
        {
            field: "pattern",
            description: "Select a pattern from the system attribute list.",
            required: "NO",
        },
        {
            field: "tags",
            description: "Comma-separated tags. Example: silk,wedding,festive.",
            required: "NO",
        },
        {
            field: "image1",
            description: "Primary product image URL. Use a publicly accessible image URL.",
            required: "YES",
        },
        {
            field: "image2",
            description: "Second product image URL. Optional.",
            required: "YES",
        },
        {
            field: "image3",
            description: "Third product image URL. Optional.",
            required: "YES",
        },
        {
            field: "image4",
            description: "Fourth product image URL. Optional.",
            required: "NO",
        },
        {
            field: "image5",
            description: "Fifth product image URL. Optional.",
            required: "NO",
        },
    ];
    instructions.forEach((item) => {
        worksheet.addRow(item);
    });
    // ============================================================
    // DESCRIPTION
    // ============================================================
    worksheet.getColumn("description").alignment = {
        wrapText: true,
        vertical: "top",
    };
    // ============================================================
    // FREEZE
    // ============================================================
    worksheet.views = [
        {
            state: "frozen",
            ySplit: 2,
            xSplit: 0,
        },
    ];
}
