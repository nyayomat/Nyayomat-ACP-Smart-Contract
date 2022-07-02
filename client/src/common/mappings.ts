/// @dev DB Mappings

import striptags from "striptags";
import {
  AssetDB,
  AssetTezos,
  UserDB,
  UserTezos,
  TransactionDB,
  TransactionTezos,
  ProviderDB,
  ProviderTezos,
  OrdersDB,
  OrdersTezos,
} from "../types";

export const mapAssetToTezos = (
  assets: AssetDB[],
  table: string
): AssetTezos[] => {
  return assets.map((asset: AssetDB) => {
    let owner = "";
    if (table?.toLowerCase().includes("merchant")) {
      owner = asset.total_out_standing_amount == 0 ? "Merchant" : "Platform";
    } else {
      owner = asset.total_out_standing_amount == 0 ? "Platform" : "Provider";
    }

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
      totalOutStandingAmount:
        asset?.total_out_standing_amount?.toString() || "",
      paymentFreq: asset.payment_frequency,
      paymentMethod: asset.payment_method,
      status: asset.status,
      table,
      owner,
      createdAt: new Date(asset.created_at).getTime().toString(),
      updatedAt: new Date(asset.updated_at).getTime().toString(),
      deletedAt: new Date(asset.deleted_at || 0).getTime().toString(),
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
  transactions: TransactionDB[],
  table: string
): TransactionTezos[] => {
  return transactions.map((transaction: TransactionDB) => {
    return {
      id: transaction.id?.toString() || "",
      assetId: transaction.asset_id?.toString() || "",
      dueDate: new Date(transaction.due_date).getTime().toString() || "",
      paidOn: new Date(transaction.paid_on).getTime().toString() || "",
      txType: transaction.type,
      owner: table.toLowerCase().includes("merchant") ? "Merchant" : "Provider",
      table,
      amount: transaction?.amount?.toString() || "",
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

export const mapOrderToTezos = (
  orders: OrdersDB[],
  table: string
): OrdersTezos[] => {
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
      totalOutStandingAmount: order?.total_out_standing_amount
        ? order.total_out_standing_amount?.toString()
        : "",
      paymentFreq: order.payment_frequency
        ? order.payment_frequency?.toString()
        : "",
      paymentMethod: order.payment_method
        ? order.payment_method?.toString()
        : "",
      status: order.status,
      table,
      orderBy: table.toLowerCase().includes("merchant")
        ? "Merchant"
        : "Provider",
      createdAt: new Date(order.created_at).getTime().toString(),
      updatedAt: new Date(order.updated_at).getTime().toString(),
    };
  });
};
