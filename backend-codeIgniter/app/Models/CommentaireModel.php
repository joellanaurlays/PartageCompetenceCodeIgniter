<?php

namespace App\Models;

use CodeIgniter\Model;

class CommentaireModel extends Model
{
    protected $table            = 'commentaires';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['date', 'texte', 'publication_id', 'utilisateur_id', 'parent_id'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'texte'           => 'required|min_length[1]',
        'publication_id'  => 'required|numeric',
        'utilisateur_id'  => 'required|numeric',
    ];

    // Relations
    public function getUtilisateur($id)
    {
        return $this->db->table('utilisateurs')
            ->where('id', $id)
            ->get()
            ->getRowArray();
    }

    public function getPublication($id)
    {
        return $this->db->table('publications')
            ->where('id', $id)
            ->get()
            ->getRowArray();
    }

    public function getReplies($commentaire_id)
    {
        return $this->where('parent_id', $commentaire_id)
                    ->orderBy('date', 'ASC')
                    ->findAll();
    }

    public function getCommentWithUser($commentaire_id)
    {
        return $this->db->table('commentaires')
            ->select('commentaires.*, utilisateurs.pseudo, utilisateurs.photo_profil')
            ->join('utilisateurs', 'utilisateurs.id = commentaires.utilisateur_id')
            ->where('commentaires.id', $commentaire_id)
            ->get()
            ->getRowArray();
    }

    public function getCommentairesWithUser($publication_id)
    {
        return $this->db->table('commentaires')
            ->select('commentaires.*, utilisateurs.pseudo, utilisateurs.photo_profil')
            ->join('utilisateurs', 'utilisateurs.id = commentaires.utilisateur_id')
            ->where('publication_id', $publication_id)
            ->where('parent_id IS NULL', null, false)
            ->orderBy('date', 'ASC')
            ->get()
            ->getResultArray();
    }
}