<?php

namespace App\Models;

use CodeIgniter\Model;

class LikeModel extends Model
{
    protected $table            = 'likes';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['date', 'publication_id', 'utilisateur_id'];

    // Dates
    protected $useTimestamps = false;
    protected $dateFormat    = 'datetime';

    // Validation
    protected $validationRules = [
        'publication_id'  => 'required|numeric',
        'utilisateur_id'  => 'required|numeric',
    ];

    // Vérifier si l'utilisateur a déjà liké
    public function hasLiked($publication_id, $utilisateur_id)
    {
        return $this->where('publication_id', $publication_id)
                    ->where('utilisateur_id', $utilisateur_id)
                    ->countAllResults() > 0;
    }

    public function getLikesByPublication($publication_id)
    {
        return $this->where('publication_id', $publication_id)->findAll();
    }

    public function getLikesByUser($utilisateur_id)
    {
        return $this->where('utilisateur_id', $utilisateur_id)->findAll();
    }
}