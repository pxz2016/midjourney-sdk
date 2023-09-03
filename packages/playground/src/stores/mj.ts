import { MidJourney, MidJourneyOptions, MjMessage } from 'midjourney-sdk'

export const useMjStore = defineStore('midjourney', {
  state: () => ({
    ins: null as MidJourney | null,
    user: null as any,
    mapping: {
      // '1147906497800577095': {
      //   id: '1147906497800577095',
      //   originId: '1147906356846796881',
      //   url: 'https://proxy.atjia.com/proxy/discordapp/ephemeral-attachments/1104268081280340012/1147906496655544380/1727283040_nonce_1147906344158756864_apple_8705833e-e93c-49ea-b8a9-0216ec8e5725.png',
      //   content:
      //     '**nonce: 1147906344158756864, apple** - <@1050755720250921033> (fast)',
      //   flags: 64,
      //   components: [
      //     {
      //       components: [
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U1',
      //           custom_id:
      //             'MJ::JOB::upsample::1::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U2',
      //           custom_id:
      //             'MJ::JOB::upsample::2::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U3',
      //           custom_id:
      //             'MJ::JOB::upsample::3::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U4',
      //           custom_id:
      //             'MJ::JOB::upsample::4::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           emoji: {
      //             name: '🔄'
      //           },
      //           custom_id:
      //             'MJ::JOB::reroll::0::8705833e-e93c-49ea-b8a9-0216ec8e5725::SOLO'
      //         }
      //       ]
      //     },
      //     {
      //       components: [
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V1',
      //           custom_id:
      //             'MJ::JOB::variation::1::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V2',
      //           custom_id:
      //             'MJ::JOB::variation::2::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V3',
      //           custom_id:
      //             'MJ::JOB::variation::3::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V4',
      //           custom_id:
      //             'MJ::JOB::variation::4::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         }
      //       ]
      //     }
      //   ],
      //   progress: 100
      // },
      // '1147906497800577095222': {
      //   id: '1147906497800577095',
      //   originId: '1147906356846796881',
      //   url: 'https://proxy.atjia.com/proxy/discordapp/ephemeral-attachments/1104268081280340012/1147906496655544380/1727283040_nonce_1147906344158756864_apple_8705833e-e93c-49ea-b8a9-0216ec8e5725.png',
      //   content:
      //     '**nonce: 1147906344158756864, apple** - <@1050755720250921033> (fast)',
      //   flags: 64,
      //   components: [
      //     {
      //       components: [
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U1',
      //           custom_id:
      //             'MJ::JOB::upsample::1::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U2',
      //           custom_id:
      //             'MJ::JOB::upsample::2::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U3',
      //           custom_id:
      //             'MJ::JOB::upsample::3::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U4',
      //           custom_id:
      //             'MJ::JOB::upsample::4::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           emoji: {
      //             name: '🔄'
      //           },
      //           custom_id:
      //             'MJ::JOB::reroll::0::8705833e-e93c-49ea-b8a9-0216ec8e5725::SOLO'
      //         }
      //       ]
      //     },
      //     {
      //       components: [
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V1',
      //           custom_id:
      //             'MJ::JOB::variation::1::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V2',
      //           custom_id:
      //             'MJ::JOB::variation::2::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V3',
      //           custom_id:
      //             'MJ::JOB::variation::3::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V4',
      //           custom_id:
      //             'MJ::JOB::variation::4::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         }
      //       ]
      //     }
      //   ],
      //   progress: 100
      // },
      // '1147906497800577095111': {
      //   id: '1147906497800577095',
      //   originId: '1147906356846796881',
      //   url: 'https://proxy.atjia.com/proxy/discordapp/ephemeral-attachments/1104268081280340012/1147906496655544380/1727283040_nonce_1147906344158756864_apple_8705833e-e93c-49ea-b8a9-0216ec8e5725.png',
      //   content:
      //     '**nonce: 1147906344158756864, apple** - <@1050755720250921033> (fast)',
      //   flags: 64,
      //   components: [
      //     {
      //       components: [
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U1',
      //           custom_id:
      //             'MJ::JOB::upsample::1::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U2',
      //           custom_id:
      //             'MJ::JOB::upsample::2::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U3',
      //           custom_id:
      //             'MJ::JOB::upsample::3::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'U4',
      //           custom_id:
      //             'MJ::JOB::upsample::4::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           emoji: {
      //             name: '🔄'
      //           },
      //           custom_id:
      //             'MJ::JOB::reroll::0::8705833e-e93c-49ea-b8a9-0216ec8e5725::SOLO'
      //         }
      //       ]
      //     },
      //     {
      //       components: [
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V1',
      //           custom_id:
      //             'MJ::JOB::variation::1::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V2',
      //           custom_id:
      //             'MJ::JOB::variation::2::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V3',
      //           custom_id:
      //             'MJ::JOB::variation::3::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         },
      //         {
      //           type: 2,
      //           style: 2,
      //           label: 'V4',
      //           custom_id:
      //             'MJ::JOB::variation::4::8705833e-e93c-49ea-b8a9-0216ec8e5725'
      //         }
      //       ]
      //     }
      //   ],
      //   progress: 100
      // }
    } as Record<MjMessage['id'], MjMessage>
  }),
  getters: {
    remix: ({ ins }) => (ins?.opts.remix ? 'yes' : 'no'),
    user: ({ ins }) => ins?.opts.user,
    initialized: ({ ins }) => ins?.opts.initialize === 'initialized'
  },
  actions: {
    init(opts: MidJourneyOptions) {
      this.ins = new MidJourney({
        ...opts,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        imgBaseUrl: import.meta.env.VITE_IMG_BASE_URL,
        wsBaseUrl: import.meta.env.VITE_WS_BASE_URL,
        skipHeartbeat: true
      })
      return this.ins.init()
    }
  }
})
