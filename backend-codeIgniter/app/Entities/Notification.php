<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class Notification extends Entity
{
    protected $attributes = [
        'id'             => null,
        'date'           => null,
        'lu'             => false,
        'type'           => null,
        'auteur_id'      => null,
        'publication_id' => null,
        'utilisateur_id' => null,
        'created_at'     => null,
    ];

    protected $casts = [
        'id'             => 'integer',
        'lu'             => 'boolean',
        'auteur_id'      => 'integer',
        'publication_id' => 'integer',
        'utilisateur_id' => 'integer',
        'date'           => 'datetime',
        'created_at'     => 'datetime',
    ];
}