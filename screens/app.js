// https://api.emojisworld.fr/v1/search

const searchInput = document.getElementById("search")
const emojiList = document.getElementById("list")
const snack = document.getElementById("snack")

const isLoading = new Proxy(
  { loading: false },
  {
    set(target, p, newValue) {
      if (p != "loading") return false
      if (newValue == true) loading()
      else finish()

      return Reflect.set(target, p, newValue)
    },
  }
)

const loading = () => {
  emojiList.innerHTML = ""

  const loadingElement = document.createElement("p")

  loadingElement.innerText = "Loading..."

  emojiList.appendChild(loadingElement)
}

const finish = () => {
  emojiList.innerHTML = ""
}

document.addEventListener("keypress", async (event) => {
  if (event.key !== "Enter") return

  isLoading.loading = true

  const res = await fetch(
    `https://api.emojisworld.fr/v1/search?q=${searchInput.value}&limit=25`
  )
  const data = await res.json()

  isLoading.loading = false

  for (const emojiSrc of data.results) {
    const { emoji, name } = emojiSrc

    const emojiItem = document.createElement("div")

    emojiItem.addEventListener("click", () => {
      window.navigator.clipboard.writeText(emoji)
      showSnack()
    })

    emojiItem.className = `relative flex flex-col items-center text-center justify-center p-4 rounded-xl cursor-pointer transition duration-300 hover:bg-black/40`

    emojiItem.innerHTML = `
    <p class="text-5xl">${emoji}</p>
    <div class="py-1.5"></div>
    <p class="text-xs">${name.split(":")[0]}</p>
   `

    emojiList.appendChild(emojiItem)
  }

  console.log(data)
})

const showSnack = () => {
  snack.animate([{ opacity: "1" }, { opacity: "0" }], {
    duration: 2000,
  })
}

document.addEventListener("keyup", async (event) => {
  if (event.key != "/") return

  searchInput.focus()
})
