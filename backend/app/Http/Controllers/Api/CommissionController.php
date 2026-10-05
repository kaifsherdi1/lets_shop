<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CommissionService;
use Illuminate\Http\Request;

class CommissionController extends Controller
{
    protected $commissionService;

    public function __construct(CommissionService $commissionService)
    {
        $this->commissionService = $commissionService;
    }

    // Get all commissions (Admin/Accountant)
    public function index(Request $request)
    {
        $filters = $request->only(['status', 'distributor_id']);
        $perPage = min(max((int) $request->get('per_page', 20), 1), 100);
        $commissions = $this->commissionService->listCommissions($filters, $perPage);

        return response()->json($commissions);
    }

    // Get my commissions (Distributor/Agent)
    public function myCommissions(Request $request)
    {
        $viewData = $this->commissionService->getDistributorCommissionView($request->user()->id, 20);

        return response()->json($viewData);
    }

    // Approve commission (Admin/Accountant)
    public function approve(Request $request, $id)
    {
        $commission = $this->commissionService->approveCommission((int) $id, $request->user()->id);

        return response()->json([
            'message' => 'Commission approved and paid successfully',
            'commission' => $commission,
        ]);
    }

    // Bulk approve commissions
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'commission_ids' => 'required|array',
            'commission_ids.*' => 'exists:commissions,id',
        ]);

        $results = $this->commissionService->bulkApprove($request->commission_ids, $request->user()->id);

        return response()->json([
            'message' => "Approved {$results['approved']} commissions, {$results['failed']} failed",
            'approved' => $results['approved'],
            'failed' => $results['failed'],
            'errors' => $results['errors'],
        ]);
    }
}
