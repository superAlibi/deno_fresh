FROM denoland/deno:latest as build

# The port that your application listens to.


WORKDIR /app

# Prefer not to run as root.


# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
# COPY deps.ts .
# RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache main.ts
RUN deno task build
FROM  denoland/deno:latest
EXPOSE 3000
USER deno
COPY --from=build /app/_fresh /app
CMD deno run  -A  /app/main.js
