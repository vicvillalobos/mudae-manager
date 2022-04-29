<template>
  <div id="ranking-app" class="content-wrapper">
    <div class="topbar">
      <div class="logo">vMudaeManager</div>
    </div>
    <div class="sidebar">
      <div class="nav-container">
        <nav>
          <ul>
            <li>
              <router-link to="/mudae-manager/">
                <i class="bi bi-people"></i> Characters
              </router-link>
            </li>
            <li>
              <router-link to="/mudae-manager/tiers">
                <i class="bi bi-award"></i> Tiers
              </router-link>
            </li>
            <li>
              <router-link to="/mudae-manager/wishlist">
                <i class="bi bi-star"></i> Wishlist
              </router-link>
            </li>
            <li>
              <router-link to="/mudae-manager/wishspawn">
                <i class="bi bi-calculator"></i> Wish Spawn Calculator
              </router-link>
            </li>
            <li>
              <router-link to="/mudae-manager/about">
                <i class="bi bi-question-circle"></i> About
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="site-content">
      <router-view />
    </div>
    <toaster ref="toasterRef" />
  </div>
</template>

<script>
import Toaster from "./components/Toaster.vue";
export default {
  components: {
    Toaster,
  },
};
</script>

<style lang="scss">
$topbar-height: 50px;
$sidebar-width: 200px;
:root body {
  --bs-body-font-size: 0.7rem;
}
$font-family-default: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
$font-family-special: Overpass, -apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-size: 8px;
  --color-shadow-blue: 103, 132, 187;
}
#app {
  width: 100vw;
  overflow: hidden;
  height: 100vh;
  background-color: rgb(237, 241, 245);
  font-family: $font-family-default;
  #ranking-app {
    width: 100%;
    position: relative;

    .v-card {
      background-color: rgb(250, 250, 250);
      border-radius: 4px;
      padding: 2em;
      position: relative;
      box-sizing: border-box;
      width: 100%;
      margin-bottom: 1em;
    }
    .card-header-outside {
      color: rgb(92, 114, 138);
      font-weight: 500;
    }

    p {
      margin-top: 0;
    }

    textarea {
      outline: none;
      width: 100%;
      min-height: 200px;
      display: block;
      box-sizing: border-box;
      background-color: #fff;
      box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05),
        0px 2px 4px rgba(0, 0, 0, 0.1);
      border-color: transparent;
      border-radius: 4px;
      font-family: $font-family-default;
      font-weight: 100;
      padding: 1em;
      transition: all 0.2s ease;
      &:focus {
        box-shadow: 0px 0px 0px 1px rgba(0, 70, 182, 0.2),
          0px 2px 4px rgba(0, 0, 0, 0.1);
      }
    }
    button {
      background-color: rgb(0, 149, 255);
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 1em 2em;
      margin: 0.4em 0;
      cursor: pointer;
      font-family: $font-family-default;
      transition: all 0.2s ease;
      font-weight: 500;
      &:hover {
        background-color: rgb(36, 186, 255);
      }
    }
    .form-group {
      margin-bottom: 1em;
      select {
        background-color: hsl(0, 0%, 98%);
        box-shadow: 0 14px 30px rgba(var(--color-shadow-blue), 0.1),
          0 4px 4px rgba(var(--color-shadow-blue), 0.04);
        color: hsl(208, 15%, 53%);
        width: 100%;
        font-family: $font-family-special;
        font-weight: 300;
        font-size: 12px;
        border: none;
        border-radius: 6px;
        padding: 11px 16px;
        padding-left: 13px;
        outline: 0;
      }
    }
    .charlist {
      display: flex;
      column-gap: 5px;
      row-gap: 20px;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .charlist.grouped {
      flex-direction: row;
      column-gap: 15px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      column-gap: 5px;
      flex-wrap: nowrap;
    }
  }
}

.content-wrapper {
  display: flex;
  height: 100vh;
  margin-top: $topbar-height;
  margin-left: $sidebar-width;
  .topbar {
    height: $topbar-height;
    background-color: hsla(235, 21%, 21%, 90%);
    backdrop-filter: blur(5px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05),
      0px 2px 4px rgba(0, 0, 0, 0.1);
    .logo {
      width: $sidebar-width;
      height: 100%;
      color: #fff;
      font-family: Overpass, sans-serif;
      font-size: 24px;
      padding: 0.3em 0;
      text-align: center;
    }
  }
  .sidebar {
    position: fixed;
    left: 0;
    top: $topbar-height;
    width: $sidebar-width;
    background-color: hsla(211, 52%, 99%, 90%);
    height: calc(100vh - #{$topbar-height});
    .nav-container {
      nav {
        font-size: 1.3em;
        ul {
          padding: 0;
          margin: 0;
          li {
            list-style-type: none;
            a {
              display: block;
              box-sizing: border-box;
              padding: 0.5em 1em;
              background-color: hsla(211, 52%, 99%);
              text-decoration: none;
              font-weight: 300;
              color: hsl(211, 20%, 45%);
              transition: all 0.2s ease;
              &.router-link-exact-active {
                color: hsl(198, 100%, 50%);
              }
              &:hover {
                background-color: rgb(243, 251, 255);
                color: hsl(198, 100%, 50%);
              }
            }
          }
        }
      }
    }
  }
  .site-content {
    width: calc(100vw - #{$sidebar-width});
    overflow: hidden;
    overflow-y: auto;
    padding: 2em;
    box-sizing: border-box;
    height: calc(100vh - #{$topbar-height});
  }
}
</style>
