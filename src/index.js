// import { createLibp2p } from "libp2p/dist/src"
import { createLibp2p } from "libp2p"
import { TCP } from "@libp2p/tcp"
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'

const main = async () => {
    const node = await createLibp2p({
        addresses: {
            listen: ['/ip4/127.0.0.1/tcp/0']
        },
        transports: [new TCP()],
        connectionEncryption: [new Noise()],
        streamMuxers: [new Mplex()]
    })
    
    await node.start()
    console.log("libp2p has started")
    
    console.log("listening on addresses")
    node.getMultiaddrs().forEach((addr) => {
        console.log(addr.toString())
    })
    
    await node.stop()
    console.log("libp2p has stopped");    
}

main().then().catch(console.error)