/// @dev DB Mappings

import { InventoryDB, InventoryTezos } from '../types';
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
