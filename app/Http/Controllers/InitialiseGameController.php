<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InitialiseGameController extends Controller
{
    public function returnGameData(Request $request) {
        return response()->json( ['name' => 'dave'] );
    }
}
