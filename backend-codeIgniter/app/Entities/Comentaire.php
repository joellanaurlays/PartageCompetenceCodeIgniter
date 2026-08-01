<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class Commentaire extends Entity
{
    protected $attributes = [
        'id'             => null,
        'date'           => null,
        'texte'          => null,
        'publication_id' => null,
        'utilisateur_id' => null,
        'parent_id'      => null,
        'created_at'     => null,
        'updated_at'     => null,
    ];

    protected $casts = [
        'id'             => 'integer',
        'publication_id' => 'integer',
        'utilisateur_id' => 'integer',
        'parent_id'      => 'integer',
        'date'           => 'datetime',
        'created_at'     => 'datetime',
        'updated_at'     => 'datetime',
    ];
}