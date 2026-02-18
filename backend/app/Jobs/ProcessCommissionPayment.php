<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessCommissionPayment implements ShouldQueue
{
    use Queueable;

    protected $commission;
    protected $adminId;

    /**
     * Create a new job instance.
     */
    public function __construct(\App\Models\Commission $commission, int $adminId)
    {
        $this->commission = $commission;
        $this->adminId = $adminId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        \Illuminate\Support\Facades\DB::beginTransaction();

        try {
            // Update models
            $this->commission->update([
                'status' => 'approved',
                'approved_by' => $this->adminId,
                'approved_at' => now(),
            ]);

            $this->commission->orderItem->update([
                'commission_status' => 'approved',
                'approved_by' => $this->adminId,
                'approved_at' => now(),
            ]);

            // Credit to wallet
            $wallet = $this->commission->distributor->wallet;
            $oldBalance = $wallet->balance;
            $newBalance = $oldBalance + $this->commission->amount;

            $wallet->update(['balance' => $newBalance]);

            // Create transaction record
            \App\Models\Transaction::create([
                'wallet_id' => $wallet->id,
                'type' => 'credit',
                'amount' => $this->commission->amount,
                'description' => 'Commission from Order #' . $this->commission->orderItem->order->order_number,
                'reference_type' => 'commission',
                'reference_id' => $this->commission->id,
                'balance_after' => $newBalance,
            ]);

            // Mark as paid
            $this->commission->update(['status' => 'paid', 'paid_at' => now()]);
            $this->commission->orderItem->update(['commission_status' => 'paid']);

            \Illuminate\Support\Facades\DB::commit();
        }
        catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            throw $e; // Rethrow for queue retry
        }
    }
}
