class WpsdRadioCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:wpsd-radio-card",
      style: "mcs2000",
      callsign_entity: "sensor.dmr_hotspot_callsign",
      talkgroup_entity: "sensor.dmr_hotspot_talkgroup",
      mode_entity: "sensor.dmr_hotspot_mode",
      source_entity: "sensor.dmr_hotspot_source",
      loss_entity: "sensor.dmr_hotspot_loss",
      ber_entity: "sensor.dmr_hotspot_ber",
      name_entity: "sensor.dmr_hotspot_name",
      timestamp_entity: "sensor.dmr_hotspot_timestamp",
      last_heard_entity: "sensor.dmr_hotspot_last_heard",
      status_entity: "sensor.dmr_hotspot_status",
    };
  }

  setConfig(config) {
    this.config = {
      title: "Home Assistant WPSD",
      style: "mcs2000",
      ...WpsdRadioCard.getStubConfig(),
      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() {
    return this.config?.style === "r7" ? 5 : 3;
  }

  connectedCallback() {
    this.render();
  }

  value(entityId, fallback = "--") {
    const state = entityId && this._hass?.states[entityId]?.state;
    return !state || state === "unknown" || state === "unavailable" ? fallback : state;
  }

  get data() {
    const callsign = this.value(this.config.callsign_entity, "DMR");
    const talkgroup = this.value(this.config.talkgroup_entity, "TG ---");
    const source = this.value(this.config.source_entity, "--");
    const name = this.value(this.config.name_entity, "");
    const timestamp = this.value(this.config.timestamp_entity, "");
    return {
      callsign,
      talkgroup,
      mode: this.value(this.config.mode_entity, "DMR"),
      source,
      loss: this.value(this.config.loss_entity, "0%"),
      ber: this.value(this.config.ber_entity, "--"),
      name,
      caller: name && name !== "--" ? `${callsign} - ${name}` : callsign,
      timestamp,
      channel: talkgroup.replace("TG ", ""),
      lastHeard: this.value(this.config.last_heard_entity, "No recent traffic"),
      connected: this.value(this.config.status_entity, "Unknown").toLowerCase() === "connected",
      activity: source.toLowerCase() === "rf" ? "tx" : source.toLowerCase() === "net" ? "rx" : "standby",
    };
  }

  render() {
    if (!this.config || !this._hass) return;
    this.innerHTML = `<ha-card>${this.config.style === "r7" ? this.renderR7() : this.renderMcs2000()}</ha-card>`;
    this.querySelector(".mcs-menu")?.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      this.querySelector(".mcs-radio")?.classList.toggle("invert");
    });
  }

  renderMcs2000() {
    const d = this.data;
    const displayLine = d.lastHeard.length > 30 ? `${d.callsign} ${d.talkgroup}` : d.lastHeard;
    return `
      <style>
        ha-card{background:#101010;border-radius:8px;padding:10px;overflow:hidden;box-shadow:inset 0 0 0 1px #000,0 8px 22px rgba(0,0,0,.35)}
        .mcs-radio{width:100%;min-width:0;color:#f1f1f1;font-family:Arial,Helvetica,sans-serif}
        .mcs-face{min-height:138px;display:grid;grid-template-columns:clamp(58px,18%,96px) minmax(0,1fr) clamp(70px,24%,132px);gap:clamp(6px,1.3vw,10px);padding:clamp(8px,1.5vw,10px);box-sizing:border-box;background:linear-gradient(#2b2d2f,#121416);border:3px solid #050505;border-radius:28px 14px 18px 18px;box-shadow:inset 0 2px 0 rgba(255,255,255,.24),inset 0 -5px 0 rgba(0,0,0,.38),0 6px 13px rgba(0,0,0,.45)}
        .mcs-left{display:grid;grid-template-columns:30px minmax(30px,42px);grid-template-rows:14px 28px 28px 28px;column-gap:5px;row-gap:4px;align-items:center}
        .mcs-leds{grid-column:1/3;display:flex;gap:7px;align-items:center;padding-left:3px}.mcs-led{width:22px;height:5px;border-radius:6px;background:#272d27;box-shadow:inset 0 1px 2px #000}
        .mcs-led.rx{background:${d.activity === "rx" ? "#d6a538" : "#3b3219"};box-shadow:${d.activity === "rx" ? "0 0 8px rgba(255,190,64,.65)" : "none"}}
        .mcs-led.tx{background:${d.activity === "tx" ? "#c83232" : d.connected ? "#284f30" : "#5a1d1d"};box-shadow:${d.activity === "tx" ? "0 0 8px rgba(255,64,64,.7)" : "none"}}
        .mcs-knob{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#7a7d7f 0 5px,transparent 6px),radial-gradient(circle,#4a4e50 0 38%,#1d2022 40% 67%,#070707 69%);border:2px solid #060606;box-shadow:inset 0 2px 4px rgba(255,255,255,.2)}
        .mcs-port{width:30px;height:24px;border-radius:5px;background:#050606;border:3px solid #313539;box-shadow:inset 0 0 0 3px #111}
        .mcs-menu,.mcs-pill,.mcs-softkey,.mcs-key{display:inline-flex;align-items:center;justify-content:center;line-height:1;color:#1b1d1f;box-shadow:inset 0 1px 1px rgba(255,255,255,.9),0 1px 2px #000}
        .mcs-pill{min-width:32px;height:18px;border-radius:14px;background:linear-gradient(#f6f6f6,#aeb0b1);font-size:8px;font-weight:800}
        .mcs-center{min-width:0;display:grid;grid-template-rows:16px minmax(72px,1fr) 22px;row-gap:5px}.mcs-brand-strip{display:flex;align-items:center;justify-content:space-between;height:16px;padding:0 5px;color:#cdd4d7;font-size:9px;font-weight:800;line-height:1}
        .mcs-brand-left,.mcs-brand-icons{display:inline-flex;align-items:center;gap:4px;min-width:0}.mcs-brand-left span{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mcs-lcd-area{display:grid;grid-template-columns:12px 1fr 12px;gap:4px;align-items:center}.mcs-arrow{width:0;height:0;border-top:9px solid transparent;border-bottom:9px solid transparent}.mcs-arrow.left{border-right:8px solid #d8d8d8;justify-self:end}.mcs-arrow.right{border-left:8px solid #d8d8d8}
        .mcs-lcd{height:72px;padding:6px 8px 5px;box-sizing:border-box;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,0) 24%),#9fc032;border:4px solid #080808;border-radius:8px;color:#18200d;font-family:"Courier New",Consolas,monospace}.mcs-radio.invert .mcs-lcd{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,0) 24%),#15200b;color:#aee044}
        .mcs-lcd-status{display:flex;align-items:center;justify-content:space-between;height:13px;font-size:clamp(9px,1.8vw,12px);font-weight:900;line-height:1}.mcs-lcd-call{display:flex;align-items:center;justify-content:center;height:24px;font-size:clamp(16px,4.4vw,26px);font-weight:900;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mcs-lcd-info{display:flex;align-items:center;justify-content:center;height:16px;font-size:clamp(9px,2.1vw,14px);font-weight:900;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mcs-softkeys{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;align-items:center}.mcs-softkey,.mcs-key,.mcs-menu{height:18px;border-radius:14px;background:linear-gradient(#fbfbfb,#bfc2c4);font-size:8px;font-weight:900}.mcs-menu{cursor:pointer}.mcs-keypad{display:grid;grid-template-rows:22px 1fr 18px;gap:5px}.mcs-badge{height:22px;border-radius:17px;background:linear-gradient(#54575a,#202326);border:2px solid #090a0b;display:flex;align-items:center;justify-content:center;color:#f3f3f3;font-size:9px;font-weight:900;line-height:1}.mcs-keys{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;align-content:start}.mcs-key small{display:none;font-size:6px;margin-left:1px}ha-icon{--mdc-icon-size:11px;width:11px;height:11px}
        @media (min-width:520px){.mcs-face{min-height:160px;grid-template-columns:96px minmax(0,1fr) 132px;gap:8px;padding:10px}.mcs-center{grid-template-rows:18px 84px 24px;row-gap:6px}.mcs-lcd{height:84px}.mcs-lcd-status{height:15px}.mcs-lcd-call{height:25px}.mcs-lcd-info{height:18px}.mcs-key small{display:inline}}
      </style>
      <div class="mcs-radio"><div class="mcs-face">
        <div class="mcs-left"><div class="mcs-leds"><span class="mcs-led rx"></span><span class="mcs-led tx"></span></div><div class="mcs-knob"></div><span class="mcs-pill">Zone</span><span class="mcs-port" title="Microphone socket"></span><span class="mcs-pill">Page</span><span></span><span class="mcs-pill">Opt</span></div>
        <div class="mcs-center"><div class="mcs-brand-strip"><span class="mcs-brand-left"><ha-icon icon="mdi:home-assistant"></ha-icon><span>${this.escape(this.config.title)}</span></span><span class="mcs-brand-icons"><ha-icon icon="mdi:radio-tower"></ha-icon><ha-icon icon="mdi:access-point"></ha-icon></span></div>
        <div class="mcs-lcd-area"><span class="mcs-arrow left"></span><div class="mcs-lcd"><div class="mcs-lcd-status"><span>${this.escape(d.mode)}</span><span>${this.escape(d.source)}</span><span>${this.escape(d.loss)}</span></div><div class="mcs-lcd-call">${this.escape(d.callsign)}</div><div class="mcs-lcd-info">${this.escape(d.talkgroup)} - ${this.escape(displayLine)}</div></div><span class="mcs-arrow right"></span></div>
        <div class="mcs-softkeys">${["P1","P2","P3","HL","Phon","Scan","Call"].map((key)=>`<span class="mcs-softkey">${key}</span>`).join("")}</div></div>
        <div class="mcs-keypad"><div class="mcs-badge">MCS2000</div><div class="mcs-keys">${["1","2<small>ABC</small>","3<small>DEF</small>","4<small>GHI</small>","5<small>JKL</small>","6<small>MNO</small>","7<small>PQRS</small>","8<small>TUV</small>","9<small>WXYZ</small>","*","0","#"].map((key)=>`<span class="mcs-key">${key}</span>`).join("")}</div><span class="mcs-menu" title="Double-click to invert LCD">Menu</span></div>
      </div></div>`;
  }

  renderR7() {
    const d = this.data;
    const dateText = d.timestamp && d.timestamp.length >= 10 ? d.timestamp.slice(0, 10).split("-").reverse().join("/") : "22/05/2026";
    const timeText = d.timestamp && d.timestamp.length >= 16 ? d.timestamp.slice(11, 16) : "19:29";
    return `
      <style>
        ha-card{background:transparent;box-shadow:none}.r7-radio{width:360px;max-width:100%;margin:0 auto;padding:12px 16px 14px;box-sizing:border-box;border-radius:22px 22px 14px 14px;background:linear-gradient(90deg,#111316 0 13px,transparent 13px calc(100% - 13px),#111316 calc(100% - 13px)),linear-gradient(#373b40,#111316);border:2px solid #070809;box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -8px 12px rgba(0,0,0,.44),0 5px 14px rgba(0,0,0,.44);color:#152737;font-family:Arial,Helvetica,sans-serif}.r7-brand{height:22px;display:flex;align-items:center;justify-content:center;color:#e7ecef;font-size:14px;font-weight:900;line-height:1;text-transform:uppercase}.r7-screen-bezel{padding:6px;border-radius:7px;background:#070809;box-shadow:inset 0 0 0 1px #2f363b}.r7-screen{height:252px;overflow:hidden;border-radius:3px;background:radial-gradient(circle at 30% 82%,rgba(17,146,210,.45),transparent 30%),radial-gradient(circle at 78% 72%,rgba(75,194,225,.35),transparent 34%),linear-gradient(#dcf8fb 0 52%,#9fe7ee 72%,#40c5e1 100%);box-shadow:inset 0 0 0 1px rgba(0,0,0,.3)}.r7-iconbar{height:26px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:5px;padding:0 8px;box-sizing:border-box;background:#1a2230;color:#f2f7fb;font-size:12px;font-weight:800;line-height:1}.r7-status-icons{display:inline-flex;align-items:center;gap:5px}.r7-datebar{height:28px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;box-sizing:border-box;background:rgba(194,241,245,.82);color:#183244;font-size:15px;font-weight:500;line-height:1}.r7-main{height:157px;padding:9px 10px 7px;box-sizing:border-box}.r7-card{height:128px;display:grid;grid-template-columns:9px 1fr;column-gap:11px;padding:10px 11px;box-sizing:border-box;background:rgba(252,252,238,.9);border:1px solid rgba(120,155,166,.7);box-shadow:0 2px 4px rgba(0,0,0,.2)}.r7-activity{background:${d.activity === "tx" ? "#d92323" : d.activity === "rx" ? "#ffd51f" : "#178ee8"};height:100%;border-radius:1px;animation:${d.activity === "standby" ? "none" : "r7-activity-pulse 900ms steps(2,end) infinite"}}@keyframes r7-activity-pulse{0%,45%{opacity:1}46%,100%{opacity:.52}}.r7-lines{min-width:0;display:grid;grid-template-rows:28px 40px 29px;row-gap:3px;padding:0;box-sizing:border-box}.r7-metrics{min-width:0;display:grid;grid-template-columns:1fr 1px 1fr;align-items:center;color:#355264}.r7-metric{min-width:0;display:grid;grid-template-rows:15px 12px;align-items:center;justify-items:center}.r7-divider{width:1px;height:24px;background:rgba(92,120,133,.48)}.r7-metric-value{max-width:100%;color:#1f2f38;font-size:13px;font-weight:900;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.r7-metric-label{color:#617582;font-size:9px;font-weight:800;line-height:1;text-transform:uppercase}.r7-channel{min-width:0;color:#1f2f38;font-size:22px;font-weight:900;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.r7-caller{min-width:0;color:#5d707b;font-size:12px;font-weight:500;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.r7-softkeys{height:36px;display:grid;grid-template-columns:1fr 1fr;background:#1798d0;color:#fff;font-size:16px;font-weight:900;line-height:36px;text-align:center;overflow:hidden}.r7-softkeys span+span{border-left:1px solid rgba(255,255,255,.45)}ha-icon{--mdc-icon-size:15px;width:15px;height:15px;display:inline-flex;flex:0 0 15px;align-items:center;justify-content:center;line-height:1}
      </style>
      <div class="r7-radio"><div class="r7-brand">WPSD DMR</div><div class="r7-screen-bezel"><div class="r7-screen"><div class="r7-iconbar"><span class="r7-status-icons"><ha-icon icon="mdi:signal-cellular-3"></ha-icon><ha-icon icon="mdi:wifi"></ha-icon><ha-icon icon="mdi:volume-high"></ha-icon></span><span>${this.escape(d.source)}</span></div><div class="r7-datebar"><span>${dateText}</span><span>${timeText}</span></div><div class="r7-main"><div class="r7-card"><div class="r7-activity"></div><div class="r7-lines"><div class="r7-metrics"><div class="r7-metric"><span class="r7-metric-value">${this.escape(d.ber)}</span><span class="r7-metric-label">BER</span></div><span class="r7-divider"></span><div class="r7-metric"><span class="r7-metric-value">${this.escape(d.loss)}</span><span class="r7-metric-label">LOSS</span></div></div><div class="r7-channel">${this.escape(d.channel)}</div><div class="r7-caller">${this.escape(d.caller)}</div></div></div></div><div class="r7-softkeys"><span>Zones</span><span>Contact</span></div></div></div></div>`;
  }

  escape(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  }
}

customElements.define("wpsd-radio-card", WpsdRadioCard);
customElements.define("wpsd-mcs2000-card", WpsdRadioCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "wpsd-radio-card",
  name: "WPSD Radio Card",
  description: "Radio-style cards for WPSD DMR Hotspot. Supports style: mcs2000 or r7.",
});
