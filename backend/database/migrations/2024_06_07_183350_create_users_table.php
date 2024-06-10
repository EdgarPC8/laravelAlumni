<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Modificar columna existente
            $table->string('new_column')->nullable()->change();
            
            // Agregar nueva columna
            $table->string('new_column_2')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Revertir los cambios hechos en el método up
            $table->string('new_column')->change();
            $table->dropColumn('new_column_2');
        });
    }
}

