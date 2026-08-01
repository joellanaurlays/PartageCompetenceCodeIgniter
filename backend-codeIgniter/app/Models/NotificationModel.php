<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table            = 'notifications';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['date', 'lu', 'type', 'auteur_id', 'publication_id', 'utilisateur_id'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'type'            => 'required',
        'auteur_id'       => 'required|numeric',
        'utilisateur_id'  => 'required|numeric',
    ];

    // Marquer comme lue
    public function markAsRead($id)
    {
        return $this->update($id, ['lu' => true]);
    }

    // Marquer toutes comme lues pour un utilisateur
    public function markAllAsRead($utilisateur_id)
    {
        return $this->set('lu', true)
                    ->where('utilisateur_id', $utilisateur_id)
                    ->where('lu', false)
                    ->update();
    }

    // Récupérer les notifications non lues
    public function getUnread($utilisateur_id)
    {
        return $this->where('utilisateur_id', $utilisateur_id)
                    ->where('lu', false)
                    ->orderBy('date', 'DESC')
                    ->findAll();
    }

    // Récupérer les notifications avec les infos de l'auteur
    public function getNotificationsWithAuteur($utilisateur_id)
    {
        return $this->db->table('notifications')
            ->select('notifications.*, auteur.pseudo as auteur_pseudo, auteur.photo_profil as auteur_photo')
            ->join('utilisateurs as auteur', 'auteur.id = notifications.auteur_id')
            ->where('notifications.utilisateur_id', $utilisateur_id)
            ->orderBy('date', 'DESC')
            ->get()
            ->getResultArray();
    }

    // Créer une notification
    public function createNotification($data)
    {
        $data['date'] = date('Y-m-d H:i:s');
        $data['lu'] = false;
        return $this->insert($data);
    }
}