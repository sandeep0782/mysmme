import ExcelJS from "exceljs";

export type ProductTemplateOption = {
  _id: string;
  name: string;
};

export type ProductTemplateGstOption = {
  _id: string;
  percentage: number;
};

export type ProductTemplateAttribute = {
  _id: string;
  type: string;
  value: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type ProductTemplateOptions = {
  brands?: ProductTemplateOption[];
  categories?: ProductTemplateOption[];
  colors?: ProductTemplateOption[];
  seasons?: ProductTemplateOption[];
  gsts?: ProductTemplateGstOption[];
  attributes?: ProductTemplateAttribute[];
};

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

export const generateProductImportTemplate = async (
  options: ProductTemplateOptions = {},
): Promise<ExcelJS.Workbook> => {
  const workbook = new ExcelJS.Workbook();

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

  const firstPrintType = getFirstAttribute(
    options.attributes,
    "printOrPatternType",
  );

  const firstPattern = getFirstAttribute(options.attributes, "pattern");

  const firstBlousePattern = getFirstAttribute(
    options.attributes,
    "blousePattern",
  );

  const firstBlouseFabric = getFirstAttribute(
    options.attributes,
    "blouseFabric",
  );

  const firstSareeFabric = getFirstAttribute(options.attributes, "sareeFabric");

  const firstType = getFirstAttribute(options.attributes, "type");

  const firstBorder = getFirstAttribute(options.attributes, "border");

  const firstOrnamentation = getFirstAttribute(
    options.attributes,
    "ornamentation",
  );

  const firstPalluDetails = getFirstAttribute(
    options.attributes,
    "palluDetails",
  );

  const firstOccasion = getFirstAttribute(options.attributes, "occasion");

  const firstTransparency = getFirstAttribute(
    options.attributes,
    "transparency",
  );

  const firstLoomType = getFirstAttribute(options.attributes, "loomType");

  worksheet.addRow({
    title: "Banarasi Silk Saree",

    description:
      "Traditional Banarasi silk saree with zari work suitable for weddings and festive occasions.",

    brand: options.brands?.[0]?.name ?? "",
    category: options.categories?.[0]?.name ?? "",
    color: options.colors?.[0]?.name ?? "",
    season: options.seasons?.[0]?.name ?? "",

    gender: "Womens",
    collectionName: "Festive Collection",

    price: 5999,
    finalPrice: 5499,
    mrp: 6999,

    gstPercentage: options.gsts?.[0]?.percentage ?? "",

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
    blouseColor: options.colors?.[0]?.name ?? "",

    blouseFabric: firstBlouseFabric?.value ?? "",
    blousePattern: firstBlousePattern?.value ?? "",
    blouseLengthSize: 0.8,

    border: firstBorder?.value ?? "",
    borderWidth: 3,

    colorRemarks: "Deep red with golden zari",

    printOrPatternType: firstPrintType?.value ?? "",
    pattern: firstPattern?.value ?? "",

    sareeFabric: firstSareeFabric?.value ?? "",
    sareeLengthSize: 5.5,

    transparency: firstTransparency?.value ?? "",
    type: firstType?.value ?? "",

    loomType: firstLoomType?.value ?? "",
    occasion: firstOccasion?.value ?? "",
    ornamentation: firstOrnamentation?.value ?? "",
    palluDetails: firstPalluDetails?.value ?? "",

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

  const brandCount = options.brands?.length ?? 0;
  const categoryCount = options.categories?.length ?? 0;
  const colorCount = options.colors?.length ?? 0;
  const seasonCount = options.seasons?.length ?? 0;
  const gstCount = options.gsts?.length ?? 0;

  const maxLength = Math.max(
    brandCount,
    categoryCount,
    colorCount,
    seasonCount,
    gstCount,
  );

  for (let i = 0; i < maxLength; i++) {
    systemData.getCell(i + 2, 1).value = options.brands?.[i]?.name ?? "";

    systemData.getCell(i + 2, 2).value = options.categories?.[i]?.name ?? "";

    systemData.getCell(i + 2, 3).value = options.colors?.[i]?.name ?? "";

    systemData.getCell(i + 2, 4).value = options.seasons?.[i]?.name ?? "";

    systemData.getCell(i + 2, 5).value = options.gsts?.[i]?.percentage ?? "";
  }

  // ============================================================
  // ATTRIBUTE DATA
  // ============================================================

  const activeAttributes = (options.attributes ?? [])
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

  const attributeTypes = Array.from(
    new Set(activeAttributes.map((attribute) => attribute.type)),
  );

  const attributeColumnMap = new Map<string, number>();

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
    workbook.definedNames.add(
      `'System-Data'!$E$2:$E$${gstCount + 1}`,
      "GSTList",
    );
  }

  // ============================================================
  // ATTRIBUTE NAMED RANGES
  // ============================================================

  for (const attributeType of attributeTypes) {
    const columnNumber = attributeColumnMap.get(attributeType);

    if (!columnNumber) {
      continue;
    }

    const count = activeAttributes.filter(
      (attribute) => attribute.type === attributeType,
    ).length;

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
    applyDropdown(
      worksheet,
      brandColumn + 1,
      START_ROW,
      END_ROW,
      `'System-Data'!$A$2:$A$${brandCount + 1}`,
    );
  }

  // ============================================================
  // CATEGORY
  // ============================================================

  const categoryColumn = getColumnIndex(columns, "category");

  if (categoryColumn !== -1 && categoryCount > 0) {
    applyDropdown(
      worksheet,
      categoryColumn + 1,
      START_ROW,
      END_ROW,
      `'System-Data'!$B$2:$B$${categoryCount + 1}`,
    );
  }

  // ============================================================
  // COLOR
  // ============================================================

  const colorColumn = getColumnIndex(columns, "color");

  if (colorColumn !== -1 && colorCount > 0) {
    applyDropdown(
      worksheet,
      colorColumn + 1,
      START_ROW,
      END_ROW,
      `'System-Data'!$C$2:$C$${colorCount + 1}`,
    );
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
    applyDropdown(
      worksheet,
      blouseColorColumn + 1,
      START_ROW,
      END_ROW,
      `'System-Data'!$C$2:$C$${colorCount + 1}`,
    );
  }

  // ============================================================
  // SEASON
  // ============================================================

  const seasonColumn = getColumnIndex(columns, "season");

  if (seasonColumn !== -1 && seasonCount > 0) {
    applyDropdown(
      worksheet,
      seasonColumn + 1,
      START_ROW,
      END_ROW,
      `'System-Data'!$D$2:$D$${seasonCount + 1}`,
    );
  }

  // ============================================================
  // GST
  // ============================================================

  const gstColumn = getColumnIndex(columns, "gstPercentage");

  if (gstColumn !== -1 && gstCount > 0) {
    applyNamedRangeDropdown(
      worksheet,
      gstColumn + 1,
      START_ROW,
      END_ROW,
      "GSTList",
      "Invalid GST",
      "Please select a GST percentage from the dropdown.",
    );
  }

  // ============================================================
  // GENDER
  // ============================================================

  const genderColumn = getColumnIndex(columns, "gender");

  if (genderColumn !== -1) {
    applyListDropdown(
      worksheet,
      genderColumn + 1,
      START_ROW,
      END_ROW,
      "Womens,Unisex",
      false,
    );
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

    const count = activeAttributes.filter(
      (attribute) => attribute.type === attributeType,
    ).length;

    if (count === 0) {
      continue;
    }

    const namedRange = getAttributeTypeNamedRangeName(attributeType);

    applyNamedRangeDropdown(
      worksheet,
      columnIndex + 1,
      START_ROW,
      END_ROW,
      namedRange,
      `Invalid ${attributeType}`,
      `Please select a valid ${attributeType} from the dropdown.`,
    );
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
};

// ============================================================
// GET FIRST ATTRIBUTE
// ============================================================

function getFirstAttribute(
  attributes: ProductTemplateAttribute[] | undefined,
  type: string,
): ProductTemplateAttribute | undefined {
  return (attributes ?? [])
    .filter((attribute) => attribute.isActive && attribute.type === type)
    .sort((a, b) => a.sortOrder - b.sortOrder)[0];
}

// ============================================================
// ATTRIBUTE TYPE NAMED RANGE
// ============================================================

function getAttributeTypeNamedRangeName(type: string): string {
  return `ATTR_${sanitizeForExcelName(type)}`.toUpperCase();
}

// ============================================================
// SANITIZE EXCEL NAME
// ============================================================

function sanitizeForExcelName(value: string): string {
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

function getColumnIndex(columns: Array<{ key: string }>, key: string): number {
  return columns.findIndex((column) => column.key === key);
}

// ============================================================
// NORMAL RANGE DROPDOWN
// ============================================================

function applyDropdown(
  worksheet: ExcelJS.Worksheet,
  columnNumber: number,
  startRow: number,
  endRow: number,
  range: string,
) {
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

function applyNamedRangeDropdown(
  worksheet: ExcelJS.Worksheet,
  columnNumber: number,
  startRow: number,
  endRow: number,
  namedRange: string,
  errorTitle: string,
  errorMessage: string,
) {
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

function applyListDropdown(
  worksheet: ExcelJS.Worksheet,
  columnNumber: number,
  startRow: number,
  endRow: number,
  values: string,
  allowBlank = false,
) {
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

function styleSystemHeader(row: ExcelJS.Row) {
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

function getColumnLetter(columnNumber: number): string {
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

function createInstructionsSheet(worksheet: ExcelJS.Worksheet) {
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
      description:
        "Select a brand from the dropdown. Brands are controlled by the system.",
      required: "YES",
    },
    {
      field: "category",
      description:
        "Select a category from the dropdown. Categories are controlled by the system.",
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
      description:
        "Select blouse color from the same system-controlled color list used by the color field.",
      required: "NO",
    },
    {
      field: "printOrPatternType",
      description:
        "Select a print or pattern type from the system attribute list.",
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
      description:
        "Primary product image URL. Use a publicly accessible image URL.",
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
