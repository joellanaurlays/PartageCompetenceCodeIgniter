<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateNotificationsTable extends Migration
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
            'lu' => [
                'type'       => 'BOOLEAN',
                'default'    => false,
            ],
            'type' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
            ],
            'auteur_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'publication_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
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
        $this->forge->addForeignKey('auteur_id', 'utilisateurs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('publication_id', 'publications', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('utilisateur_id', 'utilisateurs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('notifications');
    }

    public function down()
    {
        $this->forge->dropTable('notifications');
    }
}