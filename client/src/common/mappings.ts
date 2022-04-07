/// @dev DB Mappings

import {
  InventoryDB,
  InventoryTezos,
  AssetDB,
  AssetTezos,
  UserDB,
  UserTezos,
  TransactionDB,
  TransactionTezos,
  ProviderDB,
  ProviderTezos,
  InvoiceDB,
  InvoiceTezos,
  ProductDB,
  ProductTezos,
} from "../types";

export const mapInventoryToTezos = (
  invetories: InventoryDB[]
): InventoryTezos[] => {
  return invetories.map((inventory: InventoryDB) => {
    return {
      id: inventory.id,
      shopID: inventory.shop_id,
      title: inventory.title,
      warehouseID: inventory.warehouse_id,
      productID: inventory.product_id,
      brand: inventory.brand,
      supplierID: inventory.supplier_id,
      sku: inventory.sku,
      condition: inventory.condition,
      conditionNote: inventory.condition_note,
      description: inventory.description,
      keyFeatures: inventory.key_features,
      stockQuantity: inventory.stock_quantity,
      damagedQuantity: inventory.damaged_quantity,
      userID: inventory.user_id,
      purchasePrice: inventory.purchase_price,
      salePrice: inventory.sale_price,
      offerPrice: inventory.offer_price,
      offerStart: inventory.offer_start,
      offerEnd: inventory.offer_end,
      shippingWeight: inventory.shipping_weight,
      freeShipping: inventory.free_shipping,
      availableFrom: inventory.available_from,
      minOrderQuantity: inventory.min_order_quantity,
      slug: inventory.slug,
      linkedItems: inventory.linked_items,
      metaTitle: inventory.meta_title,
      metaDescription: inventory.meta_description,
      stuffPick: inventory.stuff_pick,
      active: inventory.active,
      deletedAt: inventory.deleted_at,
      createdAt: inventory.created_at,
      updatedAt: inventory.updated_at,
      customerPointsDiscountPercentage:
        inventory.customer_points_discount_percentage,
    };
  });
};

export const mapAssetToTezos = (assets: AssetDB[]): AssetTezos[] => {
  return assets.map((asset: AssetDB) => {
    return {
      id: asset.id?.toString() || "",
      providerId: asset?.asset_provider_id?.toString() || "",
      name: asset.asset_name,
      groupId: asset?.group_id?.toString() || "",
      subGroupId: asset?.sub_group_id?.toString() || "",
      categoryId: asset?.category_id?.toString() || "",
      image: asset.image ? asset.image : "",
      units: asset.units,
      unitCost: asset.unit_cost,
      holidayProvision: asset.holiday_provision,
      depositAmount: asset.deposit_amount,
      installment: asset.installment,
      totalOutStandingAmount: asset.total_out_standing_amount,
      paymentFreq: asset.payment_frequency,
      paymentMethod: asset.payment_method,
      status: asset.status,
      owner: asset?.group_id ? "Provider" : "Merchant",
      createdAt: new Date(asset.created_at).getTime().toString(),
      updatedAt: new Date(asset.updated_at).getTime().toString(),
      deletedAt: new Date(asset.deleted_at || 0).getTime().toString(),
    };
  });
};

export const mapInvoiceToTezos = (invoices: InvoiceDB[]): InvoiceTezos[] => {
  return invoices.map((invoice: InvoiceDB) => {
    return {
      id: invoice.id,
      userId: invoice.user_id,
      shopId: invoice.shop_id,
      providerId: invoice.provider_id,
      total: invoice.total,
      tax: invoice.tax,
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at,
      deletedAt: invoice.deleted_at,
    };
  });
};

export const mapProductToTezos = (products: ProductDB[]): ProductTezos[] => {
  return products.map((product: ProductDB) => {
    return {
      id: product.id,
      shopId: product.shop_id,
      manufacturerId: product.manufacturer_id,
      brand: product.brand,
      name: product.name,
      modelNumber: product.model_number,
      mpn: product.mpn,
      gtin: product.gtin,
      gtinType: product.gtin_type,
      description: product.description,
      minPrice: product.min_price,
      maxPrice: product.max_price,
      originCountry: product.origin_country,
      hasVariant: product.has_variant,
      requiresShipping: product.requires_shipping,
      downloadable: product.downloadable,
      slug: product.slug,
      saleCount: product.sale_count,
      active: product.active,
      deletedAt: product.deleted_at,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  });
};

export const mapUserToTezos = (users: UserDB[]): UserTezos[] => {
  return users.map((user: UserDB) => {
    return {
      id: user.id.toString(),
      onChainId: user?.onChainId || "",
      shopId: user?.shop_id?.toString() || "",
      role:
        user.role_id == "1"
          ? "SuperAdmin"
          : user.role_id == "2"
          ? "Admin"
          : "Merchant",
      description: user?.description || "",
      roleId: user?.role_id.toString() || "",
      active: user.active == 1 ? true : false,
      createdAt: new Date(user.created_at).getTime().toString(),
      updatedAt: new Date(user.updated_at).getTime().toString(),
      deletedAt: new Date(user.deleted_at).getTime().toString(),
    };
  });
};

export const mapTransactionToTezos = (
  transactions: TransactionDB[]
): TransactionTezos[] => {
  return transactions.map((transaction: TransactionDB) => {
    return {
      id: transaction.id?.toString(),
      assetId: transaction.asset_id?.toString(),
      dueDate: new Date(transaction.due_date).getTime().toString(),
      paidOn: transaction.paid_on
        ? new Date(transaction.paid_on).getTime().toString()
        : "",
      txType: transaction.type,
      initiator: transaction?.merchant_id ? "Merchant" : "Provider",
      amount: transaction.amount,
      createdAt: new Date(transaction.created_at).getTime().toString(),
      updatedAt: new Date(transaction.updated_at).getTime().toString(),
      orderId: transaction?.order_id ? transaction.order_id?.toString() : "",
      merchantId: transaction?.merchant_id
        ? transaction.merchant_id?.toString()
        : "",
      assetProviderId: transaction?.asset_provider_id
        ? transaction.asset_provider_id?.toString()
        : "",
    };
  });
};
export const mapProviderToTezos = (
  providers: ProviderDB[],
  action: "update" | "delete" | "create"
): {
  data: ProviderTezos[];
  action: "update" | "delete" | "create";
} => {
  return {
    data: providers.map((provider: ProviderDB) => {
      return {
        id: provider.id.toString(),
        shopName: provider.shop_name,
        operatingDays: provider.operating_days,
        status: provider.status,
        createdAt: new Date(provider.created_at).getTime().toString(),
        updatedAt: new Date(provider.updated_at).getTime().toString(),
        deletedAt: new Date(provider.deleted_at).getTime().toString(),
      };
    }),
    action,
  };
};
