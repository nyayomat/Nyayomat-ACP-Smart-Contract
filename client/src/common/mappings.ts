/// @dev DB Mappings

import striptags from "striptags";
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
  OrdersDB,
  OrdersTezos,
} from "../types";

export const mapInventoryToTezos = (
  invetories: InventoryDB[]
): InventoryTezos[] => {
  return invetories.map((inventory: InventoryDB) => {
    console.log({
      title: inventory?.title,
    });
    return {
      id: inventory?.id?.toString() || "",
      shopId: inventory?.shop_id?.toString() || "",
      title: inventory?.title.replaceAll(/[\uE000-\uF8FF]/g, "") || "",
      warehouseId: inventory?.warehouse_id?.toString() || "",
      productId: inventory?.product_id?.toString() || "",
      brand: inventory?.brand?.toString() || "",
      supplierId: inventory?.supplier_id?.toString() || "",
      sku: inventory?.sku?.toString() || "",
      condition: inventory?.condition?.toString() || "",
      conditionNote: inventory?.condition_note?.toString() || "",
      description: striptags(inventory?.description || "").replaceAll(
        /[\uE000-\uF8FF]/g,
        ""
      ),
      keyFeatures: inventory?.key_features?.toString() || "",
      stockQuantity: inventory?.stock_quantity?.toString() || "",
      damagedQuantity: inventory?.damaged_quantity?.toString() || "",
      userId: inventory?.user_id?.toString() || "",
      purchasePrice: inventory?.purchase_price?.toString() || "",
      salePrice: inventory?.sale_price?.toString() || "",
      offerPrice: inventory?.offer_price?.toString() || "",
      offerStartDate: new Date(inventory?.offer_start || 0)
        .getTime()
        .toString(),
      offerEndDate: new Date(inventory?.offer_end || 0).getTime().toString(),
      shippingWeight: inventory?.shipping_weight?.toString() || "",
      freeShipping: Boolean(inventory?.free_shipping),
      availableFrom: new Date(inventory?.available_from || 0)
        .getTime()
        .toString(),
      minOrderQuantity: inventory?.min_order_quantity?.toString() || "",
      slug: inventory?.slug?.toString() || "",
      linkedItems: inventory?.linked_items?.toString() || "",
      metaTitle: inventory?.meta_title?.toString() || "",
      metaDescription: inventory?.meta_description?.toString() || "",
      stuffPick: inventory?.stuff_pick?.toString() || "",
      active: Boolean(inventory?.active),
      deletedAt: new Date(inventory?.deleted_at || 0).getTime().toString(),
      createdAt: new Date(inventory?.created_at || 0).getTime().toString(),
      updatedAt: new Date(inventory?.updated_at || 0).getTime().toString(),
      customerPointsDiscountPercentage:
        inventory?.customer_points_discount_percentage?.toString() || "",
    };
  });
};

export const mapAssetToTezos = (assets: AssetDB[]): AssetTezos[] => {
  return assets.map((asset: AssetDB) => {
    return {
      id: asset.id?.toString() || "",
      providerId: asset?.asset_provider_id?.toString() || "",
      name: asset?.asset_name.replaceAll(/[\uE000-\uF8FF]/g, ""),
      groupId: asset?.group_id?.toString() || "",
      subGroupId: asset?.sub_group_id?.toString() || "",
      categoryId: asset?.category_id?.toString() || "",
      image: asset.image ? asset.image : "",
      units: asset?.units ? asset.units?.toString() : "",
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
      id: product.id?.toString() || "",
      shopId: product.shop_id ? product.shop_id.toString() : "",
      manufacturerId: product.manufacturer_id
        ? product.manufacturer_id.toString()
        : "",
      brand: product.brand || "",
      name: product?.name.replaceAll(/[\uE000-\uF8FF]/g, ""),
      modelNumber: product?.model_number?.toString()
        ? product.model_number
        : "",
      mpn: product?.mpn ? product.mpn?.toString() : "",
      gtin: product?.gtin ? product.gtin?.toString() : "",
      gtinType: product?.gtin_type ? product.gtin_type?.toString() : "",
      description: striptags(product.description || "").replaceAll(
        /[\uE000-\uF8FF]/g,
        ""
      ),
      minPrice: product.min_price ? product.min_price?.toString() : "",
      maxPrice: product.max_price ? product.max_price?.toString() : "",
      originCountry: product?.origin_country
        ? product.origin_country?.toString()
        : "",
      hasVariant: Boolean(product.has_variant),
      requiresShipping: Boolean(product.requires_shipping),
      downloadable: product.downloadable
        ? product.downloadable?.toString()
        : "",
      slug: product.slug,
      salesCount: product.sale_count ? product.sale_count?.toString() : "",
      active: Boolean(product.active),
      deletedAt: new Date(product.deleted_at).getTime().toString(),
      createdAt: new Date(product.created_at).getTime().toString(),
      updatedAt: new Date(product.updated_at).getTime().toString(),
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
      description: striptags(user?.description || "").replaceAll(
        /[\uE000-\uF8FF]/g,
        ""
      ),
      roleId: user?.role_id.toString() || "",
      active: Boolean(user.active),
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
      id: transaction.id?.toString() || "",
      assetId: transaction.asset_id?.toString() || "",
      dueDate: new Date(transaction.due_date).getTime().toString() || "",
      paidOn: new Date(transaction.paid_on).getTime().toString() || "",
      txType: transaction.type,
      owner: transaction?.merchant_id ? "Merchant" : "Provider",
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
  providers: ProviderDB[]
): ProviderTezos[] => {
  return providers.map((provider: ProviderDB) => {
    return {
      id: provider.id.toString(),
      shopName: provider.shop_name,
      operatingDays: provider.operating_days,
      status: provider.status,
      createdAt: new Date(provider.created_at).getTime().toString(),
      updatedAt: new Date(provider.updated_at).getTime().toString(),
      deletedAt: new Date(provider.deleted_at).getTime().toString(),
    };
  });
};

export const mapOrderToTezos = (orders: OrdersDB[]): OrdersTezos[] => {
  return orders.map((order: OrdersDB) => {
    return {
      id: order?.id ? order.id?.toString() : "",
      merchantId: order.merchant_id ? order.merchant_id.toString() : "",
      assetProviderId: order.asset_provider_id.toString(),
      assetId: order?.asset_id ? order.asset_id?.toString() : "",
      units: order?.units ? order.units?.toString() : "",
      unitCost: order?.unit_cost ? order.unit_cost?.toString() : "",
      holidayProvision: order?.holiday_provision
        ? order.holiday_provision?.toString()
        : "",
      depositAmount: order?.deposit_amount
        ? order.deposit_amount?.toString()
        : "",
      installment: order?.installment ? order.installment?.toString() : "",
      installmentAmount: order.installment_amount
        ? order.installment_amount?.toString()
        : "",
      totalOutStandingAmount: order.total_out_standing_amount
        ? order.total_out_standing_amount?.toString()
        : "",
      paymentFreq: order.payment_frequency
        ? order.payment_frequency?.toString()
        : "",
      paymentMethod: order.payment_method
        ? order.payment_method?.toString()
        : "",
      status: order.status,
      orderBy: order?.merchant_id ? "Merchant" : "Provider",
      createdAt: new Date(order.created_at).getTime().toString(),
      updatedAt: new Date(order.updated_at).getTime().toString(),
    };
  });
};
