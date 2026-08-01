<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class Publication extends Entity
{
    protected $attributes = [
        'id'                 => null,
        'contenu'            => null,
        'date'               => null,
        'nombre_commentaire' => 0,
        'nombre_like'        => 0,
        'photo_publier'      => null,
        'utilisateur_id'     => null,
        'created_at'         => null,
        'updated_at'         => null,
    ];

    protected $casts = [
        'id'                 => 'integer',
        'nombre_commentaire' => 'integer',
        'nombre_like'        => 'integer',
        'utilisateur_id'     => 'integer',
        'date'               => 'datetime',
        'created_at'         => 'datetime',
        'updated_at'         => 'datetime',
    ];
}