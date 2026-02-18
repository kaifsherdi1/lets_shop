<?php

namespace App\Services;

use App\Repositories\CommissionRepository;
use Illuminate\Support\Facades\DB;
use Exception;

class CommissionService
{
  protected $commissionRepository;
  protected $walletService;

  public function __construct(CommissionRepository $commissionRepository, WalletService $walletService)
  {
    $this->commissionRepository = $commissionRepository;
    $this->walletService = $walletService;
  }

  public function listCommissions(array $filters = [], int $perPage = 20)
  {
    return $this->commissionRepository->getFiltered($filters, $perPage);
  }

  public function getDistributorCommissionView(int $distributorId, int $perPage = 20)
  {
    $commissions = $this->commissionRepository->getFiltered(['distributor_id' => $distributorId], $perPage);
    $summary = $this->commissionRepository->getSummary($distributorId);

    return [
      'commissions' => $commissions,
      'summary' => $summary,
    ];
  }

  public function approveCommission(int $commissionId, int $adminId)
  {
    $commission = $this->commissionRepository->findOrFail($commissionId, ['*'], ['orderItem.order', 'distributor']);

    if ($commission->status !== 'pending') {
      throw new Exception('Commission is not pending', 400);
    }

    // Dispatch job for asynchronous processing
    \App\Jobs\ProcessCommissionPayment::dispatch($commission, $adminId);

    return $commission;
  }

  public function bulkApprove(array $ids, int $adminId)
  {
    $results = ['approved' => 0, 'failed' => 0];

    foreach ($ids as $id) {
      try {
        $this->approveCommission($id, $adminId);
        $results['approved']++;
      }
      catch (Exception $e) {
        $results['failed']++;
      }
    }

    return $results;
  }
}
