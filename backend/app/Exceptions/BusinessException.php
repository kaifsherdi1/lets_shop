<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * A rule the request broke (out of stock, not pending, insufficient balance…).
 * Its message is safe to show to the user and it carries the HTTP status.
 */
class BusinessException extends RuntimeException
{
    public function __construct(string $message, private int $status = 422)
    {
        parent::__construct($message);
    }

    public function status(): int
    {
        return $this->status;
    }
}
