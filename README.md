# PassBox

> Keep track of your passwords or generate new ones.

I was partly annoyed that just about every password manager is paid to some extent, and partly curious about encryption and how hard it would be to make one myself. I have no idea how far it will expand or if it will ever be worth choosing over a paid one, but I figured it's worth a shot.

## Installation

Binaries will be available when the project reaches a point that could be considered distributable. In the meantime, it will need to be built from source. Requires node.js and npm. Other dependencies will be installed with the program itself.

Download the repository from the green "Clone or Download" button, or clone via command line:

```sh
git clone http://github.com/cranndarach/passbox.git
```

Extract the `.zip` or `.tar.gz` if you downloaded it via the button. If you're un-tarring via command line, that's:

```sh
cd [directory/containing/tarball]
tar -xvf passbox.tar.gz
```

Next, `cd` into the directory containing the project, and install via npm:

```sh
cd passbox
npm install
```

If you are happy to run it from the command line, skip to the next section. If you want to build an executable yourself, run the following:

```sh
npm run-script build-[platform]
```

where `[platform]` is one of `win`, `mac`, or `linux`. You'll find the executable in the `dist/` folder. (The executable will be called something like `Passbox` or `Passbox.exe`.) **Note: This has only been tested for linux.** If it doesn't work, you may need to just run it from command line (or, if you fix the script, you could submit a pull request!).

## Run the app from command line

If you didn't build an executable, then once you have successfully run `npm install`, run:

```sh
npm start
```

to start the program!

## To-do/Wish list

### Realistic ideas

* I am trying to think of a good way to keep the password database safe from accidental deletion or corruption, while allowing it to be stored locally (though if a person chooses a save location in the cloud, all the better). I might try a few different things to see what works best: maybe commiting each change to a git repo, making a new file for each change and saving only the most recent N or only for K days, but it's not immediately clear what the best choice is.
* Also themes. We can't just have a white background. And better aesthetics in general, because I know it's not exactly pretty right now. I've been focusing more on the functionality.

### Slightly more wishful thoughts, but still on the agenda for some day

* Expanding to mobile, and making a browser extension, to make it actually competitive with paid password managers to some extent.
    * At minimum, a way to transport your database so that you can access it when you're away from your computer (even if that's just direct integration with something like google drive to start with).
* A way to insert your password via command line? (e.g., for sudo or some authentication).

## Contributing

Contributions are welcome, though specific information about contributing will become available as the project develops (and, since I'm new at this, I am not sure how long that will be). If you are interested in contributing in the meantime, please don't hesitate to submit an issue with any questions, or just go ahead and fork it and submit a pull request if you're feeling adventurous. Doing so will probably help me understand by doing what kinds of information I will need to facilitate further contributions.

Beginners are absolutely welcome—this project is a learning experience for me, so it makes sense for it to also be a learning experience for anyone! Along those lines, I will gladly help with whatever I can, but there might be the occasional question I don't know the answer to. So, mutual patience. :)

## License info

Copyright © 2016 R Steiner, licenced under the terms of the [MIT license](https://github.com/cranndarach/lifetracker-electron/blob/master/LICENSE).
The structure of `index.js` is adapted from [Bozon](https://github.com/railsware/bozon), © Alex Chaplinsky, MIT Licence.
