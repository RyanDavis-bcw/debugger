import BaseController from '../utils/BaseController'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { bugsService } from '../services/BugsService'
import { notesService } from '../services/NotesService'
export class BugsController extends BaseController {
  constructor() {
    super('api/bugs')
    this.router
      .get('', this.getAll)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('/:id', this.getById)
      .get('/:id/notes', this.getAllNotes)
      .post('', this.create)
      .delete('/:id', this.close)
      .put('/:id', this.edit)
  }

  async getAll(req, res, next) {
    try {
      req.query.user = req.params.user
      const data = await bugsService.getBugs(req.query)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const data = await bugsService.getOne(req.params.id)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async getAllNotes(req, res, next) {
    try {
      const data = await notesService.getNotes({ bugId: req.params.id })
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    req.body.user = req.params.user
    try {
      const data = await bugsService.create(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  // async edit(req,res,next)
  async edit(req, res, next) {
    try {
      req.body.id = req.params.id
      req.body.creatorId = req.userInfo.id
      const data = await bugsService.edit(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }

  async close(req, res, next) {
    try {
      req.body.id = req.params.id
      req.body.creatorId = req.userInfo.id

      const data = await bugsService.close(req.body)
      res.send(data)
    } catch (error) {
      next(error)
    }
  }
}
