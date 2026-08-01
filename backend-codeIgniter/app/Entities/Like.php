<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class Like extends Entity
{
    protected $attributes = [
        'id'             => null,
        'date'           => null,
        'publication_id' => null,
        'utilisateur_id' => null,
    ];

    protected $casts = [
        'id'             => 'integer',
        'publication_id' => 'integer',
        'utilisateur_id' => 'integer',
        'date'           => 'datetime',
    ];
}