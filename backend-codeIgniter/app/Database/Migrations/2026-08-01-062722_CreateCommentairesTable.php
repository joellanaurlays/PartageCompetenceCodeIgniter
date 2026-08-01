<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCommentairesTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'date' => [
                'type' => 'DATETIME',
            ],
            'texte' => [
                'type'       => 'TEXT',
            ],
            'publication_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'utilisateur_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'parent_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
                'null'       => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('publication_id', 'publications', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('utilisateur_id', 'utilisateurs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('parent_id', 'commentaires', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('commentaires');
    }

    public function down()
    {
        $this->forge->dropTable('commentaires');
    }
}