<template>
  <div class="page-about">
    <div class="v-card">
      <h5>About</h5>
      <p>
        <strong>Danpen</strong> is a web application that allows the user to represent their claimed characters in a way
        that is easy to understand, and automatically generate commands to be used with the Mudae bot, a task that
        otherwise would be tedious and time consuming.
      </p>
      <p>
        This is a small project that started as any other; I was looking for a way to view my whole character list from a
        glance and save time in the divorce and sorting process.
        The main idea at first was to be able to sort characters by importance, and then generate the
        <code>$sortmarry</code> commands to export the order over to mudae, for which I used the mudae ranking utility
      </p>
      <p>
        Made with <i class="bi bi-heart-fill" style="color:hsl(15, 70%, 55%)"></i> by <a href="https://github.com/vicvillalobos" target="_blank">Victor Villalobos</a>.
      </p>
    </div>
    <div class="v-card">
      <h5>Instructions</h5>
      <h6>Input character data</h6>
      <p>
        To start, you must enter everything the Mudae bot will send you when you enter the <code>$mm</code> command on your
        desired mudae-enabled discord channel. The command <code>$mm</code> can be used with several flags, but the ones compatible with this application are the following:
      </p>
      <ul>
        <li><code>a</code> - <strong>(Required)</strong> will group the characters by series.</li>
        <li><code>s</code> - <strong>(Required)</strong> will send the data to your DMs, making it easy to copy.</li>
        <li><code>k</code> - will attach the kakera value.</li>
        <li><code>y+</code> - will attach the key amount.</li>
        <li><code>i-</code> - will attach the selected image.</li>
      </ul>
      <p>
        The complete command with all flags (Recommended) looks like this: <code>$mmai-sky+</code>
      </p>
      <p>
        After the first time, subsequent uses of the import option will update existing characters, create new ones and remove the ones that are not present anymore.<br/>
        Even if the setting <code>downloadData</code> is enabled, data from Anilist will only be downloaded once, and will not be updated unless you manually use the <strong>Fetch</strong> function on the character card..
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
