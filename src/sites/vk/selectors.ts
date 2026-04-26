export const vkSelectors = {
  repost: {
    shareButton: '[data-testid=post_footer_action_share], .like_btns .like_btn.share._share',
    shareMy: "#like_share_my",
    shareSend: "#like_share_send",
  },
  like: {
    likeButton: '[data-testid=post_footer_action_like]:not([data-user-likes=true]), .like_btns .like_btn.like._like:not(.active)',
    alreadyLiked: '[data-testid=post_footer_action_like][data-user-likes=true], .like_btns .like_btn.like._like.active',
    firstReaction: "[data-testid=reaction-bar-item-0]",
  },
  sub: {
    followButton: ".ProfileHeaderButton button.vkuiClickable__realClickable",
  },
  group: {
    joinButton: ".vkuiButtonGroup__host button.vkuiClickable__realClickable",
  },
} as const;
