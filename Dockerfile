FROM node:8.14.0-alpine AS builder

WORKDIR /src/frontend
COPY ./frontend/package* ./
RUN npm install


COPY ./frontend ./
RUN npm run build
COPY ./ ../
RUN npm run deploy



# RUN apk update && apk upgrade && \
#     apk add --no-cache bash git openssh
# RUN npm install -g bower
# RUN bower install --config.interactive=false --allow-root


#image

FROM node:8.14.0-alpine
ENV NODE_ENV=production
ARG CI_JOB_ID
ENV APPS_APPVERSION=$CI_JOB_ID
WORKDIR /src

# RUN apk update && apk upgrade
# RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
# RUN npm install --quiet node-gyp -g

# Install deps for production only
COPY ./backend/package* ./
RUN npm install --only=production && \
    npm cache clean --force

# Copy builded source from the upper builder stage
COPY --from=builder /src/output .

# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

# Start the app
CMD npm start
