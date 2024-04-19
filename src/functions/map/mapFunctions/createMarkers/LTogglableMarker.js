import L, { Util, latLng, DomUtil } from 'leaflet'

export default L.Marker.extend({
  options: {
    toggledIconClassName: 'toggled-marker',
    selected: false
  },
  initialize(latlng, options) {
    Util.setOptions(this, options)
    this._latlng = latLng(latlng)
    this.itemId = options.itemId || L.stamp(this)
    this._selected = options.selected
  },
  onAdd(map) {
    L.Marker.prototype.onAdd.call(this, map)
    this.on('click', this.toggle, this)
    this._setIconClass()
  },
  onRemove(map) {
    L.Marker.prototype.onRemove.call(this, map)
    this.off('click', this.toggle, this)
  },
  select() {
    this._selected = true
    this._setIconClass()
  },
  unselect() {
    this._selected = false
    this._setIconClass()
  },
  toggle() {
    if (this._selected) {
      this.unselect()
    } else {
      this.select()
    }
    this.fire('marker.toggled', { itemId: this.itemId, selected: this._selected })
  },
  _setIconClass() {
    if (this._icon) {
      if (this._selected) {
        DomUtil.addClass(this._icon, this.options.toggledIconClassName)
      } else {
        DomUtil.removeClass(this._icon, this.options.toggledIconClassName)
      }
    }
  }
})