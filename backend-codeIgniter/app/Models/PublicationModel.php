<?php

namespace App\Models;

use CodeIgniter\Model;

class PublicationModel extends Model
{
    protected $table            = 'publications';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = ['contenu', 'date', 'nombre_commentaire', 'nombre_like', 'photo_publier', 'utilisateur_id'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules = [
        'contenu'          => 'required|min_length[1]',
        'utilisateur_id'   => 'required|numeric',
    ];

    // Relations
    public function getUtilisateur($id)
    {
        return $this->db->table('utilisateurs')
            ->where('id', $id)
            ->get()
            ->getRowArray();
    }

    public function getCommentaires($publication_id)
    {
        return $this->db->table('commentaires')
            ->where('publication_id', $publication_id)
            ->where('parent_id IS NULL', null, false)
            ->orderBy('date', 'ASC')
            ->get()
            ->getResultArray();
    }

    public function getReponses($commentaire_id)
    {
        return $this->db->table('commentaires')
            ->where('parent_id', $commentaire_id)
            ->orderBy('date', 'ASC')
            ->get()
            ->getResultArray();
    }

    public function getLikes($publication_id)
    {
        return $this->db->table('likes')
            ->where('publication_id', $publication_id)
            ->get()
            ->getResultArray();
    }

    public function incrementLikes($id)
    {
        return $this->set('nombre_like', 'nombre_like + 1', false)
                    ->where('id', $id)
                    ->update();
    }

    public function decrementLikes($id)
    {
        return $this->set('nombre_like', 'nombre_like - 1', false)
                    ->where('id', $id)
                    ->update();
    }

    public function incrementCommentaires($id)
    {
        return $this->set('nombre_commentaire', 'nombre_commentaire + 1', false)
                    ->where('id', $id)
                    ->update();
    }

    public function getAllWithUser()
    {
        return $this->db->table('publications')
            ->select('publications.*, utilisateurs.pseudo, utilisateurs.photo_profil')
            ->join('utilisateurs', 'utilisateurs.id = publications.utilisateur_id')
            ->orderBy('date', 'DESC')
            ->get()
            ->getResultArray();
    }
}