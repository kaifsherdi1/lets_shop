<?php

namespace App\Jobs;

use App\Exceptions\BusinessException;
use App\Models\Commission;
use App\Services\WalletService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

/**
 * Approve a commission and credit the vendor's wallet in the commission's
 * currency. Safe to run twice: the commission row is locked and re-checked, so
 * a repeated approval (double click, two admins, a queue retry) is a no-op.
 */
class ProcessCommissionPayment implements ShouldQueue
{
    use Queueable;

    public function __construct(public int $commissionId, public int $adminId)
    {
    }

    public function handle(WalletService $wallets): void
    {
        DB::transaction(function () use ($wallets) {
            $commission = Commission::with('orderItem.order')->whereKey($this->commissionId)->lockForUpdate()->first();

            if (! $commission || $commission->status !== 'pending') {
                return; // already processed (or voided) — never pay twice
            }

            $order = $commission->orderItem?->order;
            if (! $order || $order->order_status !== 'delivered') {
                throw new BusinessException('Commissions can only be approved once the order has been delivered.', 422);
            }

            $wallets->post(
                $commission->distributor_id,
                $commission->currency ?: $order->currency ?: 'AED',
                'credit',
                (float) $commission->amount,
                'Commission from Order #' . $order->order_number,
                'commission',
                $commission->id
            );

            $now = now();
            $commission->update([
                'status' => 'paid',
                'approved_by' => $this->adminId,
                'approved_at' => $now,
                'paid_at' => $now,
            ]);
            $commission->orderItem->update([
                'commission_status' => 'paid',
                'approved_by' => $this->adminId,
                'approved_at' => $now,
            ]);
        });
    }
}
