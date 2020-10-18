const linksArray = [
   {
      "name": "LinkedIn",
      "url": "https://www.linkedin.com/in/sammy-schneider/"
   },
   {
      "name": "Cloudflare",
      "url": "https://www.cloudflare.com/"
   },
   {
      "name": "LeetCode",
      "url": "https://leetcode.com/"
   }
]

class LinkTransformer {
    constructor(linksArray) {
        this.linksArray = linksArray
    }

    async element(element) {
        for (let i =0; i<linksArray.length; i++) {
            const name = linksArray[i].name;
            const url = linksArray[i].url;
            element.append(`<a href = "${url}">${name}</a>`,
            { html: true })
        }
    }
}
class ShowDisplay {
    async element(element) {
        element.setAttribute("style", "display: block")
    }
}

class ProfilePic {
    constructor(profilePic) {
        this.profilePic = profilePic
    }

    async element(element) {
        element.setAttribute("src", this.profilePic)
    }
}

class Username {
    constructor(userName) {
        this.userName = userName
    }

    async element(element) {
        element.setInnerContent(this.userName)
    }
}

async function handleRequest(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    if (path === "/links") {
        return new Response(JSON.stringify(linksArray), {
            headers: {
                "content-type": "application/json;charset=UTF-8"
            }
        })
    } else {
        const html = {
            headers: {
                "content-type": "text/html;charset=UTF-8"
            }
        }
        const response = await fetch("https://static-links-page.signalnerve.workers.dev", html);
        const res = new HTMLRewriter()
            .on("div#links", new LinkTransformer(linksArray))
            .on("div#profile", new ShowDisplay())
            .on("img#avatar", new ProfilePic("https://media-exp1.licdn.com/dms/image/C4E03AQEVDcvlNJNEGQ/profile-displayphoto-shrink_200_200/0?e=1608768000&v=beta&t=HdVQWRt4UHKekR9YbxXjfTsA9zf0x-vrjMrOFc-H-wA"))
            .on("h1#name", new Username("Sammy Schneider"))
            .transform(response)
        return res
    }
}

addEventListener("fetch", event => {
    return event.respondWith(handleRequest(event.request))
})
