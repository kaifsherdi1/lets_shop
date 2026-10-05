<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Jobs\ProcessCommissionPayment;
use App\Repositories\CommissionRepository;

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
      throw new BusinessException('Commission is not pending.', 409);
    }

    if ($commission->orderItem?->order?->order_status !== 'delivered') {
      throw new BusinessException('Commissions can only be approved once the order has been delivered.', 422);
    }

    // Run now, in this request, so the response reflects the real outcome and
    // nothing depends on a queue worker being deployed.
    ProcessCommissionPayment::dispatchSync($commission->id, $adminId);

    return $commission->fresh(['orderItem.order', 'distributor']);
  }

  public function bulkApprove(array $ids, int $adminId)
  {
    $results = ['approved' => 0, 'failed' => 0, 'errors' => []];

    foreach ($ids as $id) {
      try {
        $this->approveCommission($id, $adminId);
        $results['approved']++;
      } catch (BusinessException $e) {
        $results['failed']++;
        $results['errors'][$id] = $e->getMessage();
      }
    }

    return $results;
  }
}
