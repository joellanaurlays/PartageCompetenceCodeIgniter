<?php

namespace App\Entities;

use CodeIgniter\Entity\Entity;

class User extends Entity
{
    protected $attributes = [
        'id'            => null,
        'email'         => null,
        'mot_de_passe'  => null,
        'photo_profil'  => null,
        'pseudo'        => null,
        'created_at'    => null,
        'updated_at'    => null,
    ];

    protected $casts = [
        'id'         => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Mutateur pour hasher le mot de passe automatiquement
    public function setMotDePasse(string $password)
    {
        $this->attributes['mot_de_passe'] = password_hash($password, PASSWORD_DEFAULT);
        return $this;
    }

    // Vérifier le mot de passe
    public function verifyPassword(string $password): bool
    {
        return password_verify($password, $this->attributes['mot_de_passe']);
    }
}