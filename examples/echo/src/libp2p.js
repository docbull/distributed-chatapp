import { TCP } from '@libp2p/tcp'
import { WebSockets } from '@libp2p/websockets'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'
import defaultsDeep from '@nodeutils/defaults-deep'
import { createLibp2p as createNode } from 'libp2p'

export async function createLibp2p(_options) {
  const defaults = {
    transports: [
      new TCP(),
      new WebSockets()
    ],
    streamMuxers: [
      new Mplex()
    ],
    connectionEncryption: [
      new Noise()
    ]
  }

  return createNode(defaultsDeep(_options, defaults))
}
