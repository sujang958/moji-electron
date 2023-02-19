// https://api.emojisworld.fr/v1/search

class EmojiItem extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="relative flex flex-col items-center text-center justify-center p-4 rounded-xl cursor-pointer transition duration-300 hover:bg-black/40 focus:outline-white">
      <p class="text-5xl">${this.getAttribute("emoji")}</p>
      <div class="py-1.5"></div>
      <p class="text-xs">${this.getAttribute("emoji-name").split(":")[0]}</p>
    </div>`
  }
}

customElements.define("emoji-item", EmojiItem) // (2)

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

searchInput.addEventListener("keypress", async (event) => {
  if (event.key !== "Enter") return

  isLoading.loading = true

  const res = await fetch(
    `https://api.emojisworld.fr/v1/search?q=${searchInput.value.trim()}&limit=25`
  )
  const data = await res.json()

  isLoading.loading = false

  for (const emojiSrc in data.results) {
    const { emoji, name } = data.results[emojiSrc]

    const emojiItem = document.createElement("emoji-item")

    emojiItem.addEventListener("click", () => {
      window.navigator.clipboard.writeText(emoji)
      showSnack()
    })

    emojiItem.addEventListener("keypress", (event) => {
      if (event.key != "Enter") return

      window.navigator.clipboard.writeText(emoji)
      showSnack()
    })

    emojiItem.setAttribute("emoji", emoji)
    emojiItem.setAttribute("emoji-name", name)
    emojiItem.setAttribute("tabindex", Number(emojiSrc).toString())

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
