"use client";

import { useEffect, useState } from "react";
import { Loader2, PackageCheck } from "lucide-react";

import { useCustomerAuth } from "@/context/customer-auth-context";
import {
  getCustomerOrderById,
  getCustomerOrders,
  type CustomerOrderDetail,
  type CustomerOrderSummary,
} from "@/lib/customer-account";
import { OrderSummaryCard, formatCurrency, formatLabel } from "@/components/account/order-summary-card";

export function AccountOrders() {
  const { token } = useCustomerAuth();
  const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInitialOrders() {
      if (!token) return;

      try {
        const nextOrders = await getCustomerOrders(token);
        if (active) {
          setOrders(nextOrders);
        }
      } catch (ordersError) {
        if (active) {
          setError(ordersError instanceof Error ? ordersError.message : "Failed to load orders");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialOrders();

    return () => {
      active = false;
    };
  }, [token]);

  async function toggleOrder(orderId: number) {
    if (!token) return;

    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
      setSelectedOrder(null);
      return;
    }

    setSelectedOrderId(orderId);
    setSelectedOrder(null);
    setDetailLoading(true);
    setError("");

    try {
      setSelectedOrder(await getCustomerOrderById(token, orderId));
    } catch (orderError) {
      setError(orderError instanceof Error ? orderError.message : "Failed to load order details");
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <section className="rounded-[24px] border border-brandGold/30 bg-white p-5 shadow-[0_12px_35px_rgba(0,69,31,0.06)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-brandGold uppercase">
            Orders
          </p>
          <h2 className="mt-2 text-xl font-black text-brandEmerald">Order history</h2>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full bg-brandCream text-brandEmerald">
          <PackageCheck className="size-5" aria-hidden="true" />
        </div>
      </div>

      {loading ? (
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-brandGold/30 bg-brandCream px-4 py-3 text-sm font-bold text-brandEmerald">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading orders
        </div>
      ) : null}

      {error ? (
        <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      {!loading && !error && orders.length === 0 ? (
        <p className="mt-5 rounded-2xl bg-brandCream/70 px-4 py-4 text-sm leading-6 text-[#5F5F5F]">
          Your linked order history will appear here after checkout.
        </p>
      ) : null}

      <div className="mt-5 grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3">
            <OrderSummaryCard
              order={order}
              expanded={selectedOrderId === order.id}
              loading={detailLoading && selectedOrderId === order.id}
              onToggle={() => void toggleOrder(order.id)}
            />

            {selectedOrderId === order.id && detailLoading ? (
              <div className="rounded-[20px] border border-brandGold/30 bg-brandCream/70 px-4 py-3 text-sm font-bold text-brandEmerald">
                Loading order details
              </div>
            ) : null}

            {selectedOrderId === order.id && selectedOrder ? (
              <div className="rounded-[20px] border border-brandGold/30 bg-brandCream/70 p-4">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="font-bold text-brandEmerald">Payment method: </span>
                    <span className="capitalize text-[#5F5F5F]">{formatLabel(selectedOrder.paymentMethod)}</span>
                  </p>
                  <p>
                    <span className="font-bold text-brandEmerald">Delivery to: </span>
                    <span className="text-[#5F5F5F]">{selectedOrder.fullName}</span>
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-bold text-brandEmerald">Address: </span>
                    <span className="text-[#5F5F5F]">{selectedOrder.address}</span>
                  </p>
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-brandGold/30 bg-white">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-2 border-b border-brandGold/20 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[1fr_auto]"
                    >
                      <div>
                        <p className="font-bold text-brandEmerald">{item.name}</p>
                        <p className="mt-1 text-[#5F5F5F]">Qty {item.quantity}</p>
                      </div>
                      <p className="font-bold text-brandEmerald">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <dl className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5F5F5F]">Subtotal</dt>
                    <dd className="font-bold text-brandEmerald">{formatCurrency(selectedOrder.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#5F5F5F]">Delivery</dt>
                    <dd className="font-bold text-brandEmerald">{formatCurrency(selectedOrder.deliveryFee)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-brandGold/30 pt-2">
                    <dt className="font-bold text-brandEmerald">Total</dt>
                    <dd className="font-black text-brandEmerald">{formatCurrency(selectedOrder.total)}</dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
