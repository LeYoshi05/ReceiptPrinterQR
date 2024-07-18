<script>
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);

    const key = urlParams.get('key')
    document.getElementById("p1").innerHTML = key;
</script>