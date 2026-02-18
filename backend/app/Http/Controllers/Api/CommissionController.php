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
        $commissions = $this->commissionService->listCommissions($filters, 20);

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
        try {
            $commission = $this->commissionService->approveCommission($id, $request->user()->id);

            return response()->json([
                'message' => 'Commission approved and paid successfully',
                'commission' => $commission,
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage() ?: 'Failed to approve commission',
            ], $e->getCode() ?: 400);
        }
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
        ]);
    }
}
