# Rebuild the source code only when needed
FROM registry.access.redhat.com/ubi8/nodejs-14-minimal AS builder
USER root
WORKDIR /app
RUN npm install -g yarn
COPY . .
RUN $(npm get prefix)/bin/yarn install --frozen-lockfile --ignore-optional
RUN $(npm get prefix)/bin/yarn format
RUN $(npm get prefix)/bin/yarn build
RUN $(npm get prefix)/bin/yarn install --production --ignore-scripts --prefer-offline --ignore-optional

# Production image, copy all the files and run next
FROM registry.access.redhat.com/ubi8/nodejs-14-minimal AS runner
USER root
WORKDIR /app
RUN microdnf install shadow-utils

ENV NODE_ENV production

RUN groupadd -g 1001 nodejs
RUN useradd nextjs -u 1001

COPY --from=builder /app/out ./out
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
