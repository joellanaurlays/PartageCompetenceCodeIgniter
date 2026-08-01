<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'utilisateurs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['email', 'mot_de_passe', 'photo_profil', 'pseudo'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'email'         => 'required|valid_email|is_unique[utilisateurs.email]',
        'mot_de_passe'  => 'required|min_length[8]',
        'pseudo'        => 'required|min_length[3]|is_unique[utilisateurs.pseudo]',
    ];

    protected $validationMessages = [
        'email' => [
            'is_unique' => 'Cet email est déjà utilisé.',
        ],
        'pseudo' => [
            'is_unique' => 'Ce pseudo est déjà pris.',
        ],
    ];

    // Hash du mot de passe avant insertion
    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    protected function hashPassword(array $data)
    {
        if (isset($data['data']['mot_de_passe'])) {
            $data['data']['mot_de_passe'] = password_hash($data['data']['mot_de_passe'], PASSWORD_DEFAULT);
        }
        return $data;
    }

    // Relations
    public function getPublications($id)
    {
        return $this->db->table('publications')
            ->where('utilisateur_id', $id)
            ->orderBy('date', 'DESC')
            ->get()
            ->getResultArray();
    }

    public function getNotifications($id)
    {
        return $this->db->table('notifications')
            ->where('utilisateur_id', $id)
            ->orderBy('date', 'DESC')
            ->get()
            ->getResultArray();
    }
}