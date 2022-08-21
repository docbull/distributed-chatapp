import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'
import { Bootstrap } from '@libp2p/bootstrap'

document.addEventListener('DOMContentLoaded', async () => {
    const webRtcStar = new WebRTCStar()

    // create libp2p node
    const libp2p = await createLibp2p({
        addresses: {
            listen: [
                '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
                '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star'
            ]
        },
        transports: [
            new WebSockets(),
            webRtcStar
        ],
        connectionEncryption: [new Noise()],
        streamMuxers: [new Mplex()],
        peerDiscovery: [
            webRtcStar.discovery,
            new Bootstrap({
                list: [
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
                    '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
                ]
            })
        ]
    })

    const status = document.getElementById('status')
    const output = document.getElementById('output')

    output.textContent = ''

    function log (txt) {
        console.info(txt)
        output.textContent += `${txt.trim()}\n`
    }

    // print a log when a peer is discovered
    libp2p.addEventListener('peer:discovery', (event) => {
        const peer = event.detail
        log(`Found peer ${peer.id.toString()}`)
    })

    // print a log when the peer is disconnected
    libp2p.connectionManager.addEventListener('peer:disconnect', (event) => {
        const connection = event.detail
        log(`Disconnected from ${connection.remotePeer.toString()}`)
    })

    // run the libp2p node
    await libp2p.start()
    status.innerText = 'libp2p started'
    log(`libp2p node ID: ${libp2p.peerId.toString()}`)

    window.libp2p = libp2p
})