/// @dev DB Mappings

import {
  InventoryDB,
  InventoryTezos,
  AssetDB,
  AssetTezos,
  UserDB,
  UserTezos,
  MerchantTxDB,
  ProviderTxDB,
  TransactionTezos,
} from '../types';
import { InvoiceDB, InvoiceTezos } from '../types/invoice';
import { ProductDB, ProductTezos } from '../types/product';

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
      id: asset.id,
      providerId: asset.asset_provider_id,
      name: asset.asset_name,
      groupId: asset?.group_id,
      subGroupId: asset?.sub_group_id,
      categoryId: asset?.category_id,
      image: asset?.image,
      units: asset.units,
      unitCost: asset.unit_cost,
      holidayProvision: asset.holiday_provision,
      depositAmount: asset.deposit_amount,
      installment: asset.installment,
      totalOutstandingAmount: asset.total_out_standing_amount,
      paymentFreq: asset.payment_frequency,
      paymentMethod: asset.payment_method,
      status: asset.status,
      owner: asset?.group_id ? 'Provider' : 'Merchant',
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
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
      id: user.id,
      name: user.name,
      shopId: user.shop_id,
      role:
        user.role_id == '1'
          ? 'SuperAdmin'
          : user.role_id == '2'
          ? 'Admin'
          : 'Merchant',
      description: user.description,
      roleId: user.role_id,
      active: user.active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      deletedAt: user.deleted_at,
    };
  });
};

export const mapTransactionToTezos = (
  transactions: MerchantTxDB[] | ProviderTxDB[]
): TransactionTezos[] => {
  const merchant_tx = transactions.some(
    (transaction: MerchantTxDB) => transaction.merchant_id
  );
  const provider_tx = transactions.some(
    (transaction: ProviderTxDB) => transaction.asset_provider_id
  );
  if (merchant_tx) {
    return transactions.map((transaction: MerchantTxDB) => {
      return {
        id: transaction.id,
        merchantId: transaction.merchant_id,
        orderId: transaction.order_id,
        assetId: transaction.asset_id,
        dueDate: transaction.due_date,
        paidOn: transaction.paid_on,
        txType: transaction.type,
        initiator: 'Merchant',
        amount: transaction.amount,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      };
    });
  }
  if (provider_tx) {
    return transactions.map((transaction: ProviderTxDB) => {
      return {
        id: transaction.id,
        assetProviderId: transaction.asset_provider_id,
        assetId: transaction.asset_id,
        dueDate: transaction.due_date,
        paidOn: transaction.paid_on,
        txType: transaction.type,
        initiator: 'Provider',
        amount: transaction.amount,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      };
    });
  }
};
