<template>
    <nav id="topbar" class="navbar navbar-expand-lg bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            Danpen
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle link-light" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Characters
            </a>
            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
                <li><router-link class="dropdown-item" to="/">All Characters</router-link></li>
                <li><router-link class="dropdown-item" to="/tiers">Tiers</router-link></li>
            </ul>
            </li>
            <li class="nav-item">
            <router-link class="nav-link link-light" to="/wishlist">Wishlist</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link link-light" to="/calculator">Calculator</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link link-light" to="/settings">Settings</router-link>
            </li>
            <li class="nav-item">
            <router-link class="nav-link link-light" to="/about">About</router-link>
            </li>
        </ul>
        <div class="topbar-actions d-flex">
            <button class="btn btn-primary" @click.prevent="showMmasDialogue">
                <i class="bi bi-download"></i> Import
            </button>
            <button class="btn btn-primary" @click.prevent="globalSave">
                <i class="bi bi-save"></i> Save All
            </button>
            <div class="vr"></div>
            <div class="dropdown">
                <button class="btn btn-success dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-upload"></i> Export
                </button>
                <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" href="#">$sortmarry commands</a></li>
                    <li><a class="dropdown-item" href="#">$wish command</a></li>
                </ul>
            </div>
        </div>
        </div>
    </div>
    </nav>
</template>

<script setup>
import { inject } from "vue";

const emitter = inject('emitter');

// Methods
function showMmasDialogue() {
    emitter.emit('show-mmas-dialogue');
}

function globalSave() {
    emitter.emit('global-save');
}
</script>

<style lang="scss">
#topbar {
    font-family: Overpass, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    .navbar-brand {
        color:#fff;
    }
    .dropdown-item {
        font-size: 0.8rem;
    }
    .topbar-actions {
        display: flex;
        justify-content: flex-end;
        column-gap: 5px;
        margin-right:1em;
    }
}
</style>