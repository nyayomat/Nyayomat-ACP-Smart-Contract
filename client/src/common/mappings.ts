/// @dev DB Mappings

import {
  InventoryDB,
  InventoryTezos,
  AssetDB,
  AssetTezos,
  UserDB,
  UserTezos,
} from '../types';

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
      totalOutstandingAmount: asset.total_outstanding_amount,
      paymentFreq: asset.payment_frequency,
      paymentMethod: asset.payment_method,
      status: asset.status,
      owner: asset?.group_id ? 'Provider' : 'Merchant',
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
    };
  });
};
