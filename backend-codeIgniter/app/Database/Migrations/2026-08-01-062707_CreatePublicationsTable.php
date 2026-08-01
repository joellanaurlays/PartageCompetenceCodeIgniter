<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePublicationsTable extends Migration
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
            'contenu' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'date' => [
                'type' => 'DATE',
            ],
            'nombre_commentaire' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'nombre_like' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'photo_publier' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
            ],
            'utilisateur_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
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
        $this->forge->addForeignKey('utilisateur_id', 'utilisateurs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('publications');
    }

    public function down()
    {
        $this->forge->dropTable('publications');
    }
}